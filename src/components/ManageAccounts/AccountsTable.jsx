import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const AccountsTable = ({ filteredAccounts, editMode, deleteMode, handleEdit, handleDelete, loading }) => {
  return (
    <>
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th>Account ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Department</th>
                {editMode && <th>Edit</th>}
                {deleteMode && <th>Delete</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => (
                <tr key={acc._id}>
                  <td>{acc.account_id}</td>
                  <td>
                    {acc.firstname} {acc.lastname}
                  </td>
                  <td>{acc.email}</td>
                  <td>{acc.user_type}</td>
                  <td>{acc.department || "—"}</td>
                  {editMode && (
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleEdit(acc)}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                  {deleteMode && (
                    <td>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(acc)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AccountsTable;