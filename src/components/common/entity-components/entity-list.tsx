import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Type definition for a column in the entity list
export type EntityListColumn<T> = {
  key: string;
  header: ReactNode;
  cell: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
};

// Type definition for the props of the EntityList component
interface EntityListProps<T> {
  items: T[];
  columns: EntityListColumn<T>[];
  getKey?: (item: T, index: number) => string | number;
  emptyView?: ReactNode;
  className?: string;
}

// Generic EntityList component that renders a table based on the provided items and columns
export function EntityList<T>({
  items,
  columns,
  getKey,
  emptyView,
  className,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className=" max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow >
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  " py-5 ",
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={getKey ? getKey(item, index) : index}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(item, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
