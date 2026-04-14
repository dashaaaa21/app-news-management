interface UserFormHeaderProps {
    title?: string;
}

export default function UserFormHeader({
    title = 'Edit User',
}: UserFormHeaderProps) {
    return (
        <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <p className="text-lg font-semibold">{title}</p>
            </div>
        </div>
    );
}
