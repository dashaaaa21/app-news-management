interface UsersTableHeaderProps {
    isAllSelected: boolean;
    onSelectAll: () => void;
    isManager?: boolean;
}

export default function UsersTableHeader({
    isAllSelected,
    onSelectAll,
    isManager = false,
}: UsersTableHeaderProps) {
    return (
        <thead>
            <tr className="border-b border-dashed border-[#a9a99e]">
                {!isManager && (
                    <th className="px-4 py-3 text-left">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={onSelectAll}
                            className="w-4 h-4 cursor-pointer"
                        />
                    </th>
                )}
                <th className="px-4 py-3 text-left text-sm text-[#65655e] font-medium">
                    Name
                </th>
                <th className="px-4 py-3 text-left text-sm text-[#65655e] font-medium">
                    Email
                </th>
                <th className="px-4 py-3 text-left text-sm text-[#65655e] font-medium">
                    Position
                </th>
                <th className="px-4 py-3 text-left text-sm text-[#65655e] font-medium">
                    Phone
                </th>
                <th className="px-4 py-3 text-left text-sm text-[#65655e] font-medium">
                    Role
                </th>
                <th className="px-4 py-3 text-left text-sm text-[#65655e] font-medium">
                    Hire Date
                </th>
                <th className="px-4 py-3 text-right text-sm text-[#65655e] font-medium">
                    Actions
                </th>
            </tr>
        </thead>
    );
}
