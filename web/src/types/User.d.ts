interface User {
  _id: {
    $oid: string;
  };
  firstname: string;
  lastname: string;
  email: string;
  status: "Pending" | "Active";
  admin: boolean;
  write: boolean;
}
export default User;
