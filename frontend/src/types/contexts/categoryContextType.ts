export interface CategoryContextType {
    categories: string[];
    categoryInfo: {
        [categoryName: string]: string;
    };
    categorySelect: string;
    setCategorySelect: React.Dispatch<React.SetStateAction<string>>;
    active: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
    showCategories: boolean;
    setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
    handleShowCategories: () => void;
}
