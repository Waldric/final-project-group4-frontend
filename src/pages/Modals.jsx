import DeleteSubjectModal from "../components/ModalComponents/DeleteSubjectModal";
import SubjectModal from "../components/ModalComponents/SubjectModal";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";

const Modals = () => {
  const { user } = useAuth();
  const { subMod, deleteSubj } = useModal();

  if (user.user_type === "Admin") {
    return <>
    {subMod.status && <SubjectModal />}
    {deleteSubj.status && <DeleteSubjectModal />}
    </>;
  }
};

export default Modals;
