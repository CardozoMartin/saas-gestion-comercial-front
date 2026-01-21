import type { User } from "../../types/auth.types";

interface TableUsersProps {
  users?: User[] | { data?: User[] };
}

const TableUsers = ({ users }: TableUsersProps) => {
  const usersList = Array.isArray(users) ? users : users?.data || [];
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-300/70">
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            #
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Nombre
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Email
          </th>
          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Telefono
          </th>

          <th className="text-left px-3 py-3 text-gray-800/80 font-medium">
            Estado
          </th>
        </tr>
      </thead>
      <tbody>
        {usersList?.map((user: any, index: number) => (
          <tr
            key={user.userId ?? (user as any)?.id ?? index}
            className="border-b border-gray-300/50 last:border-0 hover:bg-gray-500/20 transition"
          >
            <td className="px-3 py-3 text-gray-800/80 font-medium">
              {index + 1}
            </td>
            <td className="px-3 py-3 text-gray-800/80 font-medium">
              {user.nombre} {user.apellido}
            </td>
            <td className="px-3 py-3 text-gray-800/80 font-medium">
              {user.email}
            </td>
            <td className="px-3 py-3 text-gray-800/80">{user.telefono}</td>

            <td className="px-3 py-3">
              {user.activo ? (
                <button className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium">
                  Activo
                </button>
              ) : (
                <button className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium">
                  Inactivo
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableUsers;
