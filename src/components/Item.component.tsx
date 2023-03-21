import React, { useState, useEffect } from "react";

interface ItemProps {
    item: {
        id: number;
        title: string;
        completed: boolean;
    };
    onUpdate: () => void;
    onDelete: () => void;
    onToggleCheck: (itemId: number) => void;
}

const Item: React.FC<ItemProps> = ({ item, onUpdate, onDelete, onToggleCheck }) => {
    const { id, title, completed } = item;

    const [isChecked, setIsChecked] = useState<boolean>(completed);

    useEffect(() => {
        setIsChecked(completed);
    }, [completed]);

    const checkHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);

        // const updatedItem = {
        //     id,
        //     title,
        //     completed: e.target.checked,
        // };

        onToggleCheck(id);
    };

    return (
        <li className="item">
            <div className="info">
                <input type="checkbox" checked={isChecked} onChange={checkHandler} />
                <span>{title}</span>
            </div>
            <div className="actions">
                <button onClick={onUpdate}>✍</button>
                <button onClick={onDelete}>❌</button>
            </div>
        </li>
    );
};

export default Item;
