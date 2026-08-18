'use client';

import { useEffect, useState } from 'react';
import {
  FiUserPlus,
  FiUsers,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiX,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiUser,
} from 'react-icons/fi';

import { User } from '../../types/types';
import UserForm from '../UserForm/UserForm';
import UserTable from '../UserTable/UserTable';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type AdminRole = 'USER' | 'ADMIN' | 'MODERATOR';

type AdminUpdateUser = {
  name?: string;
  lastname?: string;
  email?: string;
  role?: AdminRole;
  isEmailVerified?: boolean;
};

type AdminUsersResponse = {
  items: User[];
  total: number;
  page: number;
  limit: number;
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [editForm, setEditForm] =
    useState<AdminUpdateUser>({});

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    admins: 0,
  });

  // ==========================================================================
  // Notifications
  // ==========================================================================

  const showError = (message: string) => {
    setError(message);
    setSuccess(null);

    window.setTimeout(() => {
      setError(null);
    }, 4000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setError(null);

    window.setTimeout(() => {
      setSuccess(null);
    }, 3500);
  };

  // ==========================================================================
  // Auth
  // ==========================================================================

  const getAuthHeaders = (): HeadersInit => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    return {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // ==========================================================================
  // Fetch Users
  // ==========================================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!API_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL is not configured',
        );
      }

      const response = await fetch(
        `${API_URL}/users/admin?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || 'Failed to fetch users',
        );
      }

      const result: AdminUsersResponse =
        await response.json();

      const normalizedUsers: User[] = (
        result.items ?? []
      ).map((user: any) => ({
        ...user,
        id: user.id ?? user._id,
      }));

      setUsers(normalizedUsers);
      setTotal(result.total ?? 0);

      setStats({
        total: result.total ?? 0,

        verified: normalizedUsers.filter(
          (user) =>
            user.isEmailVerified === true,
        ).length,

        admins: normalizedUsers.filter(
          (user) =>
            user.role?.toUpperCase() === 'ADMIN',
        ).length,
      });
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch users',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ==========================================================================
  // Create User
  // ==========================================================================

  const handleAddUser = async (
    newUser: Omit<User, 'id'>,
  ) => {
    try {
      setSaving(true);

      if (!API_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL is not configured',
        );
      }

      const response = await fetch(
        `${API_URL}/users`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(newUser),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || 'Failed to create user',
        );
      }

      const createdUser = await response.json();

      const normalizedUser: User = {
        ...createdUser,
        id:
          createdUser.id ??
          createdUser._id,
      };

      /*
       * اگر صفحه اول هستیم، کاربر جدید را
       * مستقیم به لیست اضافه می‌کنیم.
       */
      if (page === 1) {
        setUsers((prev) => [
          normalizedUser,
          ...prev,
        ]);
      }

      setTotal((prev) => prev + 1);

      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        verified:
          prev.verified +
          (normalizedUser.isEmailVerified
            ? 1
            : 0),
        admins:
          prev.admins +
          (normalizedUser.role?.toUpperCase() ===
          'ADMIN'
            ? 1
            : 0),
      }));

      showSuccess(
        'User created successfully',
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : 'Failed to create user',
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // Delete User
  // ==========================================================================

  const handleRemoveUser = async (
    userId: string,
  ) => {
    if (!userId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this user?',
    );

    if (!confirmed) return;

    const deletedUser = users.find(
      (user) => user.id === userId,
    );

    try {
      setSaving(true);

      if (!API_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL is not configured',
        );
      }

      const response = await fetch(
        `${API_URL}/users/${userId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || 'Failed to delete user',
        );
      }

      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== userId,
        ),
      );

      setTotal((prev) =>
        Math.max(0, prev - 1),
      );

      setStats((prev) => ({
        total: Math.max(0, prev.total - 1),

        verified:
          prev.verified -
          (deletedUser?.isEmailVerified
            ? 1
            : 0),

        admins:
          prev.admins -
          (deletedUser?.role?.toUpperCase() ===
          'ADMIN'
            ? 1
            : 0),
      }));

      showSuccess(
        'User deleted successfully',
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : 'Failed to delete user',
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // Open Edit Modal
  // ==========================================================================

  const handleEditUser = (user: User) => {
    setEditingUser(user);

    setEditForm({
      name: user.name ?? '',
      lastname: user.lastname ?? '',
      email: user.email ?? '',
      role:
        (user.role?.toUpperCase() as AdminRole) ??
        'USER',
      isEmailVerified:
        user.isEmailVerified ?? false,
    });
  };

  // ==========================================================================
  // Close Edit Modal
  // ==========================================================================

  const closeEditModal = () => {
    if (saving) return;

    setEditingUser(null);
    setEditForm({});
  };

  // ==========================================================================
  // Update User
  // ==========================================================================

  const handleUpdateUser = async (
    userId: string,
    data: AdminUpdateUser,
  ) => {
    if (!userId) return;

    const oldUser = users.find(
      (user) => user.id === userId,
    );

    if (!oldUser) {
      showError('User not found');
      return;
    }

    try {
      setSaving(true);

      if (!API_URL) {
        throw new Error(
          'NEXT_PUBLIC_BACKEND_URL is not configured',
        );
      }

      const response = await fetch(
        `${API_URL}/users/admin/${userId}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.message ||
            'Failed to update user',
        );
      }

      const updatedUser =
        await response.json();

      const normalizedUser: User = {
        ...oldUser,
        ...updatedUser,
        ...data,
        id:
          updatedUser.id ??
          updatedUser._id ??
          userId,
      };

      // ----------------------------------------------------------------------
      // Update only the edited user
      // ----------------------------------------------------------------------

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? normalizedUser
            : user,
        ),
      );

      // ----------------------------------------------------------------------
      // Update stats
      // ----------------------------------------------------------------------

      setStats((prev) => {
        const oldIsAdmin =
          oldUser.role?.toUpperCase() ===
          'ADMIN';

        const newIsAdmin =
          normalizedUser.role?.toUpperCase() ===
          'ADMIN';

        const oldIsVerified =
          oldUser.isEmailVerified === true;

        const newIsVerified =
          normalizedUser.isEmailVerified === true;

        return {
          ...prev,

          admins:
            prev.admins +
            (newIsAdmin ? 1 : 0) -
            (oldIsAdmin ? 1 : 0),

          verified:
            prev.verified +
            (newIsVerified ? 1 : 0) -
            (oldIsVerified ? 1 : 0),
        };
      });

      setEditingUser(null);
      setEditForm({});

      showSuccess(
        'User updated successfully',
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : 'Failed to update user',
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================================
  // Pagination
  // ==========================================================================

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit),
  );

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div className="min-h-full bg-[#fff7f8] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}

        <header
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-red-100
            bg-white
            px-5
            py-5
            shadow-sm
            md:px-7
            md:py-6
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-52
              w-52
              rounded-full
              bg-red-100/60
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-1/3
              h-40
              w-40
              rounded-full
              bg-red-50
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-red-100
                  text-[#DF2648]
                  shadow-sm
                "
              >
                <FiUsers size={22} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    User Management
                  </h1>

                  <span
                    className="
                      hidden
                      rounded-full
                      bg-red-100
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-wider
                      text-[#DF2648]
                      sm:inline-flex
                    "
                  >
                    Admin
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Manage users, roles and account access
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchUsers}
              disabled={loading || saving}
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-100
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-gray-700
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-red-200
                hover:bg-red-50
                hover:text-[#DF2648]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FiRefreshCw
                size={16}
                className={
                  loading
                    ? 'animate-spin'
                    : 'transition-transform duration-300 group-hover:rotate-180'
                }
              />

              Refresh
            </button>
          </div>
        </header>

        {/* ================================================================= */}
        {/* NOTIFICATION */}
        {/* ================================================================= */}

        {(error || success) && (
          <div
            className={`
              flex
              items-center
              gap-3
              rounded-2xl
              border
              px-4
              py-3.5
              shadow-sm
              animate-fade-in
              ${
                error
                  ? 'border-red-100 bg-red-50 text-red-700'
                  : 'border-emerald-100 bg-emerald-50 text-emerald-700'
              }
            `}
          >
            {error ? (
              <FiAlertCircle
                size={18}
                className="shrink-0"
              />
            ) : (
              <FiCheckCircle
                size={18}
                className="shrink-0"
              />
            )}

            <p className="flex-1 text-sm font-medium">
              {error ?? success}
            </p>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccess(null);
              }}
              className="rounded-lg p-1 transition-colors hover:bg-black/5"
            >
              <FiX size={17} />
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* STATS */}
        {/* ================================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Users"
            value={stats.total}
            icon={<FiUsers size={20} />}
            iconClass="bg-red-100 text-[#DF2648]"
            cardClass="border-red-100 hover:border-red-200"
          />

          <StatCard
            title="Verified Users"
            value={stats.verified}
            icon={<FiCheckCircle size={20} />}
            iconClass="bg-emerald-100 text-emerald-600"
            cardClass="border-emerald-100 hover:border-emerald-200"
          />

          <StatCard
            title="Admin Users"
            value={stats.admins}
            icon={<FiShield size={20} />}
            iconClass="bg-amber-100 text-amber-600"
            cardClass="border-amber-100 hover:border-amber-200"
          />
        </div>

        {/* ================================================================= */}
        {/* MAIN */}
        {/* ================================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-[320px_minmax(0,1fr)]
          "
        >
          {/* =============================================================== */}
          {/* ADD USER */}
          {/* =============================================================== */}

          <section
            className="
              h-fit
              overflow-hidden
              rounded-3xl
              border
              border-red-100
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                border-b
                border-red-50
                bg-gradient-to-r
                from-red-50
                to-white
                px-5
                py-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                    text-[#DF2648]
                  "
                >
                  <FiUserPlus size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Add New User
                  </h2>

                  <p className="text-xs text-gray-500">
                    Create a new account
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <UserForm
                onSubmit={handleAddUser}
              />
            </div>
          </section>

          {/* =============================================================== */}
          {/* USER DIRECTORY */}
          {/* =============================================================== */}

          <section
            className="
              min-w-0
              overflow-hidden
              rounded-3xl
              border
              border-red-100
              bg-white
              shadow-sm
            "
          >
            {/* Table Header */}

            <div
              className="
                border-b
                border-red-50
                bg-gradient-to-r
                from-red-50/80
                via-white
                to-white
                px-5
                py-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">
                      User Directory
                    </h2>

                    <span className="h-1.5 w-1.5 rounded-full bg-[#DF2648]" />
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    Manage existing accounts
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="
                      rounded-full
                      bg-gray-100
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-gray-600
                    "
                  >
                    {total}{' '}
                    {total === 1
                      ? 'user'
                      : 'users'}
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-red-100
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                      text-[#DF2648]
                    "
                  >
                    Page {page}
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}

            <div className="relative">
              {loading ? (
                <LoadingState />
              ) : users.length === 0 ? (
                <EmptyState />
              ) : (
                <UserTable
                  users={users}
                  onRemove={handleRemoveUser}
                  onEdit={handleEditUser}
                />
              )}
            </div>

            {/* Pagination */}

            {!loading && totalPages > 1 && (
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  border-t
                  border-red-50
                  bg-red-50/30
                  px-5
                  py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <p className="text-xs text-gray-500">
                  Showing{' '}

                  <span className="font-semibold text-gray-700">
                    {(page - 1) * limit + 1}
                  </span>{' '}

                  -{' '}

                  <span className="font-semibold text-gray-700">
                    {Math.min(
                      page * limit,
                      total,
                    )}
                  </span>{' '}

                  of{' '}

                  <span className="font-semibold text-gray-700">
                    {total}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() =>
                      setPage((p) =>
                        Math.max(1, p - 1),
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      border-red-100
                      bg-white
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-gray-600
                      transition-all
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-[#DF2648]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <FiChevronLeft size={16} />
                    Previous
                  </button>

                  <div
                    className="
                      flex
                      h-9
                      min-w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#DF2648]
                      px-3
                      text-sm
                      font-bold
                      text-white
                      shadow-sm
                    "
                  >
                    {page}
                  </div>

                  <button
                    type="button"
                    disabled={
                      page >= totalPages ||
                      loading
                    }
                    onClick={() =>
                      setPage((p) =>
                        Math.min(
                          totalPages,
                          p + 1,
                        ),
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      border-red-100
                      bg-white
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-gray-600
                      transition-all
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-[#DF2648]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Next
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ================================================================== */}
      {/* EDIT USER MODAL */}
      {/* ================================================================== */}

      {editingUser && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-[4px]
            animate-fade-in
          "
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving
            ) {
              closeEditModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-lg
              overflow-hidden
              rounded-3xl
              border
              border-red-100
              bg-white
              shadow-2xl
              animate-modal-in
            "
          >
            {/* Modal Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-red-50
                bg-gradient-to-r
                from-red-50
                to-white
                px-6
                py-5
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-red-100
                    text-[#DF2648]
                  "
                >
                  <FiEdit2 size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Edit User
                  </h2>

                  <p className="text-xs text-gray-500">
                    Update account information
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-400
                  transition-all
                  hover:bg-red-100
                  hover:text-[#DF2648]
                  disabled:opacity-40
                "
              >
                <FiX size={19} />
              </button>
            </div>

            {/* User Preview */}

            <div
              className="
                mx-6
                mt-5
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-red-50
                bg-red-50/50
                p-3.5
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-red-100
                  text-[#DF2648]
                "
              >
                <FiUser size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {editingUser.name}{' '}
                  {editingUser.lastname}
                </p>

                <p className="flex items-center gap-1 truncate text-xs text-gray-400">
                  <FiMail size={12} />
                  {editingUser.email}
                </p>
              </div>
            </div>

            {/* Form */}

            <div className="space-y-5 p-6">
              <FormInput
                label="Name"
                value={editForm.name ?? ''}
                placeholder="Enter name"
                onChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
              />

              <FormInput
                label="Lastname"
                value={
                  editForm.lastname ?? ''
                }
                placeholder="Enter lastname"
                onChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    lastname: value,
                  }))
                }
              />

              <FormInput
                label="Email"
                type="email"
                value={editForm.email ?? ''}
                placeholder="example@email.com"
                onChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    email: value,
                  }))
                }
              />

              {/* Role */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
                  Role
                </label>

                <select
                  value={
                    editForm.role ?? 'USER'
                  }
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role: e.target
                        .value as AdminRole,
                    }))
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-3.5
                    py-3
                    text-sm
                    font-medium
                    text-gray-800
                    outline-none
                    transition-all
                    focus:border-red-200
                    focus:bg-white
                    focus:ring-4
                    focus:ring-red-100
                  "
                >
                  <option value="USER">
                    User
                  </option>

                  <option value="MODERATOR">
                    Moderator
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>
              </div>

              {/* Verified */}

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-red-100
                  bg-red-50/50
                  p-4
                  transition-all
                  hover:border-red-200
                  hover:bg-red-50
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-red-100
                      text-[#DF2648]
                    "
                  >
                    <FiCheckCircle size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Email verified
                    </p>

                    <p className="text-xs text-gray-400">
                      Mark this account as verified
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={
                    editForm.isEmailVerified ??
                    false
                  }
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isEmailVerified:
                        e.target.checked,
                    }))
                  }
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    accent-[#DF2648]
                  "
                />
              </label>
            </div>

            {/* Footer */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-red-50
                bg-red-50/30
                px-6
                py-4
              "
            >
              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-600
                  transition-all
                  hover:border-gray-300
                  hover:bg-gray-50
                  disabled:opacity-40
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!editingUser?.id) return;

                  handleUpdateUser(
                    editingUser.id,
                    editForm,
                  );
                }}
                disabled={saving}
                className="
                  inline-flex
                  min-w-[145px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#DF2648]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-[#c91f3f]
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <>
                    <FiRefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Animations */}
      {/* ================================================================== */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-modal-in {
          animation: modalIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  cardClass: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
  cardClass,
}: StatCardProps) => {
  return (
    <div
      className={`
        group
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${cardClass}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>

        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            transition-all
            duration-200
            group-hover:scale-105
            ${iconClass}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FORM INPUT
// ============================================================================

interface FormInputProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}

const FormInput = ({
  label,
  value,
  placeholder,
  type = 'text',
  onChange,
}: FormInputProps) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          px-3.5
          py-3
          text-sm
          font-medium
          text-gray-800
          placeholder:text-gray-300
          outline-none
          transition-all
          focus:border-red-200
          focus:bg-white
          focus:ring-4
          focus:ring-red-100
        "
      />
    </div>
  );
};

// ============================================================================
// LOADING
// ============================================================================

const LoadingState = () => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-red-100" />

        <div
          className="
            absolute
            inset-0
            h-10
            w-10
            animate-spin
            rounded-full
            border-2
            border-transparent
            border-t-[#DF2648]
          "
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">
          Loading users
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Please wait a moment...
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY
// ============================================================================

const EmptyState = () => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
      <div
        className="
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-red-50
          text-[#DF2648]
        "
      >
        <FiUsers size={24} />
      </div>

      <h3 className="font-semibold text-gray-800">
        No users found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-400">
        There are no users available on this page.
      </p>
    </div>
  );
};