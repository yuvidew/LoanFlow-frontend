"use client";

import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { EditAndAddDialog } from "@/components/common/edit-add-dialog";
import { EntityContainer } from "@/components/common/entity-components/entity-container";
import { EntityEmptyView } from "@/components/common/entity-components/entity-empty-view";
import { EntityHeader } from "@/components/common/entity-components/entity-header";
import {
  EntityList,
  type EntityListColumn,
} from "@/components/common/entity-components/entity-list";
import { EntityPagination } from "@/components/common/entity-components/entity-pagination";
import { EntitySearch } from "@/components/common/entity-components/entity-search";
import { EntitySelect } from "@/components/common/entity-components/entity-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import type { User, UserStatusFilter } from "@/features/users/types";
import { calculateAge, formatCurrency, formatToken } from "@/lib/utils";
import { useUserEligibleProducts, useUserList } from "../hooks/use-users";
import UserForm from "./user-form";

const PAGE_SIZE = 5;
const SEARCH_DEBOUNCE_MS = 300;

type UserWithAction = User & {
  onViewEligibleProducts: () => void;
};

const userColumns: EntityListColumn<UserWithAction>[] = [
  {
    key: "fullName",
    header: "Name",
    cell: (user) => <span className="font-medium">{user.fullName}</span>,
  },
  {
    key: "age",
    header: "Age",
    cell: (user) => calculateAge(user.dateOfBirth),
  },
  {
    key: "creditScore",
    header: "Credit Score",
    cell: (user) => user.creditScore,
  },
  {
    key: "employmentType",
    header: "Employment",
    cell: (user) => formatToken(user.employmentType),
  },
  {
    key: "salary",
    header: "Salary",
    cell: (user) => (
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{formatToken(user.salaryType)}</Badge>
        <Badge variant="secondary">{formatCurrency(user.monthlySalary)}</Badge>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (user) => (
      <Badge variant={user.status === "REJECTED" ? "destructive" : "secondary"}>
        {formatToken(user.status)}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    cell: (user) => user.status === "ACTIVE" ? (
      <Button variant="outline" size="sm" onClick={user.onViewEligibleProducts}>
        <CheckIcon className="size-4" />
        View Eligible Products
      </Button>
    ) : (
      <span className="text-muted-foreground text-xs">Not eligible</span>
    ),
  },
];

export const UsersView = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [isEligibleDialogOpen, setIsEligibleDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("ALL");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const { data: currentUser } = useCurrentUser();
  const canCreateUsers = currentUser?.data.role === "ADMIN";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const { data, isError, isFetching, isLoading } = useUserList({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const {
    data: eligibleProductsData,
    isError: isEligibleProductsError,
    isLoading: isEligibleProductsLoading,
  } = useUserEligibleProducts(
    selectedUserId,
    isEligibleDialogOpen && !!selectedUserId,
  );

  const users = data?.data.users ?? [];
  const totalPages = Math.max(data?.data.pagination.totalPages ?? 1, 1);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleFilterChange = (value: UserStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const usersWithActions: UserWithAction[] = users.map((user) => ({
    ...user,
    monthlySalary: Number(user.monthlySalary),
    onViewEligibleProducts: () => {
      setSelectedUserId(user.id);
      setSelectedUserName(user.fullName);
      setIsEligibleDialogOpen(true);
    },
  }));

  return (
    <>
      <EntityContainer
        header={
          canCreateUsers ? (
            <EntityHeader
              title="Users"
              description="Review admins, viewers, and loan applicants."
              newButtonLabel="Add User"
              onNew={() => setIsOpenDialog(true)}
            />
          ) : (
            <EntityHeader
              title="Users"
              description="Review admins, viewers, and loan applicants."
            />
          )
        }
        search={
          <EntitySearch
            value={query}
            onChange={handleSearchChange}
            placeholder="Search users"
          />
        }
        filter={
          <EntitySelect
            items={[
              { value: "ALL", label: "All" },
              { value: "ACTIVE", label: "Active" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            value={statusFilter}
            onChange={handleFilterChange}
            placeholder="Filter by status"
          />
        }
        pagination={
          usersWithActions.length > 0 ? (
            <EntityPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              disabled={isFetching}
            />
          ) : undefined
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            Loading users...
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-10 text-destructive">
            Failed to load users.
          </div>
        ) : (
          <EntityList
            items={usersWithActions}
            columns={userColumns}
            getKey={(user) => user.id}
            emptyView={
              <EntityEmptyView
                empty_label={query ? "No users found" : "No users"}
                message={
                  query
                    ? "Try a different name or status."
                    : "Users will appear here after they are created."
                }
              />
            }
          />
        )}
      </EntityContainer>

      <EditAndAddDialog
        title={`Eligible Products for ${selectedUserName}`}
        description="These are the products that the user is eligible for based on their profile."
        open={isEligibleDialogOpen}
        onOpenChange={(open) => {
          setIsEligibleDialogOpen(open);

          if (!open) {
            setSelectedUserId("");
            setSelectedUserName("");
          }
        }}
        formComponent={
          <div className="flex flex-col gap-2">
            {isEligibleProductsLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading eligible products...
              </p>
            ) : isEligibleProductsError ? (
              <p className="text-sm text-destructive">
                Failed to load eligible products.
              </p>
            ) : eligibleProductsData?.data.length ? (
              eligibleProductsData.data.map((product) => (
                <Badge key={product.id} variant="secondary">
                  {product.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No eligible products found for this user.
              </p>
            )}
          </div>
        }
      />

      <EditAndAddDialog
        title="Add User"
        description="Create a new user account with specific roles and permissions."
        open={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        formComponent={
          <UserForm
            onCancel={() => setIsOpenDialog(false)}
            submitLabel="Add User"
          />
        }
      />
    </>
  );
};

export default UsersView;
