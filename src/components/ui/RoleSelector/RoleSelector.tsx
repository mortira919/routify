import { useState } from 'react';
import { Shield, Plus, X } from 'lucide-react';
import styles from './RoleSelector.module.css';

interface RoleSelectorProps {
    selectedRoles: string[];
    onChange: (roles: string[]) => void;
    availableRoles?: string[];
}

const DEFAULT_ROLES = ['admin', 'user', 'guest', 'moderator'];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
    selectedRoles,
    onChange,
    availableRoles = DEFAULT_ROLES
}) => {
    const [customRole, setCustomRole] = useState('');

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            onChange(selectedRoles.filter(r => r !== role));
        } else {
            onChange([...selectedRoles, role]);
        }
    };

    const addCustomRole = () => {
        const trimmed = customRole.trim().toLowerCase();
        if (trimmed && !selectedRoles.includes(trimmed)) {
            onChange([...selectedRoles, trimmed]);
            setCustomRole('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomRole();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.roles}>
                {availableRoles.map(role => (
                    <button
                        key={role}
                        className={`${styles.roleBtn} ${selectedRoles.includes(role) ? styles.selected : ''}`}
                        onClick={() => toggleRole(role)}
                    >
                        <Shield size={12} />
                        {role}
                    </button>
                ))}
            </div>

            <div className={styles.selectedRoles}>
                {selectedRoles
                    .filter(r => !availableRoles.includes(r))
                    .map(role => (
                        <span key={role} className={styles.customRole}>
                            {role}
                            <button
                                className={styles.removeBtn}
                                onClick={() => toggleRole(role)}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
            </div>

            <div className={styles.customInput}>
                <input
                    type="text"
                    className={styles.input}
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Custom role..."
                />
                <button
                    className={styles.addBtn}
                    onClick={addCustomRole}
                    disabled={!customRole.trim()}
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
};
