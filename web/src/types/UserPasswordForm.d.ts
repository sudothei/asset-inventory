interface UserPasswordForm {
  oid?: string;
  token?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  status?: "Pending" | "Active";
  admin?: boolean;
  write?: boolean;
  password?: string;
  confirm?: string;
}
export default UserPasswordForm;
