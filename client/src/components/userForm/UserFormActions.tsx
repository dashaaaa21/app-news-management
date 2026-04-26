import { Button } from '../ui/buttons/Button';

interface ICompanyFormActionsProps {
    onSave: () => void;
    onBack: () => void;
}

export default function CompanyFormActions({
    onSave,
    onBack,
}: ICompanyFormActionsProps) {
    return (
        <div className="flex gap-3 px-10 pb-5">
            <Button
                onClick={onSave}
                variant="primary"
                className="rounded-[20px] text-base px-6 py-3"
            >
                Save
            </Button>
            <Button
                onClick={onBack}
                variant="secondary"
                className="rounded-[20px] text-base px-6 py-3"
            >
                Back
            </Button>
        </div>
    );
}
