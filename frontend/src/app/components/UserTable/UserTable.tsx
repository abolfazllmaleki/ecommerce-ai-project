'use client';

import {
  FiEdit2,
  FiTrash2,
  FiShield,
} from 'react-icons/fi';

import { User } from '../../types/types';

interface UserTableProps {
  users: User[];

  onRemove: (userId: string) => void;

  onEdit: (user: User) => void;
}

const UserTable = ({
  users,
  onRemove,
  onEdit,
}: UserTableProps) => {
  // ============================================================
  // Empty State
  // ============================================================

  if (!users.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div
          className="
            mb-3
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-red-50
            text-red-400
          "
        >
          <FiShield className="h-5 w-5" />
        </div>

        <p className="text-sm font-medium text-gray-700">
          No users found
        </p>

        <p className="mt-1 text-xs text-gray-400">
          There are no users to display.
        </p>
      </div>
    );
  }

  // ============================================================
  // Table
  // ============================================================

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse">

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">

            <th
              className="
                w-[190px]
                px-3
                py-2.5
                text-left
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              User
            </th>

            <th
              className="
                w-[190px]
                px-3
                py-2.5
                text-left
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Email
            </th>

            <th
              className="
                w-[115px]
                px-3
                py-2.5
                text-left
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Role
            </th>

            <th
              className="
                w-[115px]
                px-3
                py-2.5
                text-left
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Status
            </th>

            <th
              className="
                w-[125px]
                px-3
                py-2.5
                text-right
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Actions
            </th>

          </tr>
        </thead>

        {/* ====================================================== */}
        {/* BODY */}
        {/* ====================================================== */}

        <tbody className="divide-y divide-gray-100">

          {users.map((user) => (
            <tr
              key={user.id}
              className="
                group
                h-[68px]
                transition-colors
                duration-200
                hover:bg-gray-50/70
              "
            >

              {/* ================================================= */}
              {/* USER */}
              {/* ================================================= */}

              <td className="w-[190px] px-3 py-2">

                <div className="flex items-center gap-2">

                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-red-50
                    "
                  >
                    <span
                      className="
                        text-[11px]
                        font-semibold
                        text-red-500
                      "
                    >
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || 'U'}
                    </span>
                  </div>

                  {/* User Info */}

                  <div className="min-w-0">

                    <div
                      className="
                        max-w-[130px]
                        truncate
                        text-xs
                        font-medium
                        text-gray-800
                      "
                      title={`${user.name ?? ''} ${
                        user.lastname ?? ''
                      }`}
                    >
                      {user.name}{' '}
                      {user.lastname}
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-[9px]
                        text-gray-400
                      "
                    >
                      ID:{' '}
                      {user.id.slice(0, 6)}
                    </div>

                  </div>

                </div>

              </td>

              {/* ================================================= */}
              {/* EMAIL */}
              {/* ================================================= */}

              <td className="w-[190px] px-3 py-2">

                <span
                  title={user.email}
                  className="
                    block
                    max-w-[175px]
                    truncate
                    text-xs
                    text-gray-600
                  "
                >
                  {user.email}
                </span>

              </td>

              {/* ================================================= */}
              {/* ROLE */}
              {/* ================================================= */}

              <td className="w-[115px] px-3 py-2">

                <RoleBadge
                  role={user.role}
                />

              </td>

              {/* ================================================= */}
              {/* STATUS */}
              {/* ================================================= */}

              <td className="w-[115px] px-3 py-2">

                {user.isEmailVerified ? (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-green-50
                      px-2
                      py-0.5
                      text-[10px]
                      font-medium
                      text-green-600
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-green-500
                      "
                    />

                    Verified
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-gray-100
                      px-2
                      py-0.5
                      text-[10px]
                      font-medium
                      text-gray-500
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-gray-400
                      "
                    />

                    Unverified
                  </span>
                )}

              </td>

              {/* ================================================= */}
              {/* ACTIONS */}
              {/* ================================================= */}

              <td className="w-[125px] px-3 py-2">

                <div
                  className="
                    flex
                    items-center
                    justify-end
                    gap-1.5
                  "
                >

                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() =>
                      onEdit(user)
                    }
                    className="
                      inline-flex
                      h-8
                      items-center
                      justify-center
                      gap-1
                      rounded-md
                      bg-red-50
                      px-2.5
                      text-[10px]
                      font-medium
                      text-red-500
                      transition-all
                      hover:bg-red-100
                      active:scale-95
                    "
                  >
                    <FiEdit2 className="h-3 w-3" />

                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(user.id)
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-md
                      bg-gray-50
                      text-gray-400
                      transition-all
                      hover:bg-red-50
                      hover:text-red-500
                      active:scale-95
                    "
                    title="Delete user"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>

                </div>

              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
};

// ================================================================
// Role Badge
// ================================================================

const RoleBadge = ({
  role,
}: {
  role: User['role'];
}) => {
  const normalizedRole =
    role?.toUpperCase();

  // ------------------------------------------------------------
  // ADMIN
  // ------------------------------------------------------------

  if (normalizedRole === 'ADMIN') {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-full
          bg-red-50
          px-2
          py-0.5
          text-[10px]
          font-semibold
          text-red-600
        "
      >
        <FiShield className="h-3 w-3" />

        Admin
      </span>
    );
  }

  // ------------------------------------------------------------
  // MODERATOR
  // ------------------------------------------------------------

  if (normalizedRole === 'MODERATOR') {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1
          rounded-full
          bg-orange-50
          px-2
          py-0.5
          text-[10px]
          font-semibold
          text-orange-600
        "
      >
        Moderator
      </span>
    );
  }

  // ------------------------------------------------------------
  // USER
  // ------------------------------------------------------------

  return (
    <span
      className="
        inline-flex
        items-center
        rounded-full
        bg-gray-100
        px-2
        py-0.5
        text-[10px]
        font-medium
        text-gray-600
      "
    >
      User
    </span>
  );
};

export default UserTable;