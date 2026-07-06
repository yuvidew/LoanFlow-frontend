"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserStatusFilter } from "@/features/users/types";

interface EntitySelectProps {
    items: { value: string; label: string }[];
    value: string;
    onChange: (value: UserStatusFilter) => void;
    placeholder?: string;
}

export const EntitySelect = ({
    items,
    onChange,
    value,
    placeholder,
}: EntitySelectProps) => {
    return (
        <Select
            items={items}
            onValueChange={(value) => {
                if (value !== null) {
                    onChange(value as UserStatusFilter);
                }
            }}
            value={value}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder || "Theme"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
