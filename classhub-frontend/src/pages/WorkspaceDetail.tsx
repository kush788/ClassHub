import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  workspaceApi,
  WorkspaceMemberResponse,
  WorkspaceResponse,
} from "../api/workspaceApi";

import {
  resourceApi,
  ResourceResponse,
  ResourceType,
} from "../api/resourceApi";

import {
  assignmentApi,
  AssignmentResponse,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "../api/assignmentApi";

import {
  submissionApi,
  SubmissionResponse,
} from "../api/submissionApi";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Download,
  File,
  FileImage,
  FileText,
  FileVideo,
  FolderArchive,
  CalendarDays,
  ClipboardList,
  Edit3,
  ExternalLink,
  LoaderCircle,
  Send,
  Plus,
  Presentation,
  RefreshCw,
  Trash2,
  Upload,
  Users,
  UserRoundCheck,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AnimatePresence,
  
} from "motion/react";

export const WorkspaceDetail: React.FC = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const navigate = useNavigate();

  const { user } = useAuth();
  const { addToast } = useToast();

  const [workspace, setWorkspace] =
    useState<WorkspaceResponse | null>(null);

  const [members, setMembers] = useState<
    WorkspaceMemberResponse[]
  >([]);

  const [resources, setResources] = useState<
    ResourceResponse[]
  >([]);

  const [assignments, setAssignments] = useState<
    AssignmentResponse[]
  >([]);

  const [mySubmissions, setMySubmissions] = useState<
    SubmissionResponse[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [membersLoading, setMembersLoading] =
    useState(false);

  const [resourcesLoading, setResourcesLoading] =
    useState(false);

  const [assignmentsLoading, setAssignmentsLoading] =
    useState(false);

  const [copied, setCopied] = useState(false);

  const [regeneratingCode, setRegeneratingCode] =
    useState(false);

  const [deletingWorkspace, setDeletingWorkspace] =
    useState(false);

  const [deletingResourceId, setDeletingResourceId] =
    useState<string | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] =
    useState(false);

  const [uploadTitle, setUploadTitle] =
    useState("");

  const [uploadDescription, setUploadDescription] =
    useState("");

  const [uploadFile, setUploadFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] =
    useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentResponse | null>(null);

  const [assignmentTitle, setAssignmentTitle] =
    useState("");

  const [assignmentDescription, setAssignmentDescription] =
    useState("");

  const [assignmentInstructions, setAssignmentInstructions] =
    useState("");

  const [assignmentMaxMarks, setAssignmentMaxMarks] =
    useState("100");

  const [assignmentDueDate, setAssignmentDueDate] =
    useState("");

  const [savingAssignment, setSavingAssignment] =
    useState(false);

  const [deletingAssignmentId, setDeletingAssignmentId] =
    useState<string | null>(null);

  const [submissionsLoading, setSubmissionsLoading] =
    useState(false);

  const [isSubmissionModalOpen, setIsSubmissionModalOpen] =
    useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentResponse | null>(null);

  const [submissionContent, setSubmissionContent] =
    useState("");

  const [submissionAttachmentUrl, setSubmissionAttachmentUrl] =
    useState("");

  const [savingSubmission, setSavingSubmission] =
    useState(false);

  const [deletingSubmissionId, setDeletingSubmissionId] =
    useState<string | null>(null);

  const [expandedSubmissionAssignmentId, setExpandedSubmissionAssignmentId] =
    useState<string | null>(null);

  const [teacherSubmissions, setTeacherSubmissions] =
    useState<Record<string, SubmissionResponse[]>>({});

  const [teacherSubmissionsLoadingId, setTeacherSubmissionsLoadingId] =
    useState<string | null>(null);

  const [gradeDrafts, setGradeDrafts] =
    useState<
      Record<
        string,
        {
          marksObtained: string;
          feedback: string;
        }
      >
    >({});

  const [gradingSubmissionId, setGradingSubmissionId] =
    useState<string | null>(null);

type ConfirmDialogState = {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  variant: "danger" | "warning" | "default";
  action: (() => Promise<void> | void) | null;
};

const [confirmDialog, setConfirmDialog] =
  useState<ConfirmDialogState>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirm",
    variant: "danger",
    action: null,
  });

const [confirmDialogLoading, setConfirmDialogLoading] =
  useState(false);

  const isTeacher =
    user?.role?.toUpperCase() === "TEACHER";

  const getErrorMessage = (
    error: any,
    fallback: string,
  ): string => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );
  };
  const openConfirmDialog = ({
  title,
  description,
  confirmText = "Confirm",
  variant = "danger",
  action,
}: {
  title: string;
  description: string;
  confirmText?: string;
  variant?: "danger" | "warning" | "default";
  action: () => Promise<void> | void;
}) => {
  setConfirmDialog({
    open: true,
    title,
    description,
    confirmText,
    variant,
    action,
  });
};

const closeConfirmDialog = () => {
  if (confirmDialogLoading) {
    return;
  }

  setConfirmDialog((current) => ({
    ...current,
    open: false,
    action: null,
  }));
};

const executeConfirmAction = async () => {
  const action = confirmDialog.action;

  if (!action) {
    return;
  }

  setConfirmDialogLoading(true);

  try {
    await action();

    setConfirmDialog((current) => ({
      ...current,
      open: false,
      action: null,
    }));
  } catch (error) {
    console.error(
      "Confirmation action failed:",
      error,
    );
  } finally {
    setConfirmDialogLoading(false);
  }
};

  const fetchWorkspace = async () => {
    if (!workspaceId) {
      addToast(
        "Workspace ID is missing.",
        "error",
      );

      navigate(
        isTeacher
          ? "/teacher/dashboard"
          : "/student/dashboard",
      );

      return;
    }

    setLoading(true);

    try {
      const data =
        await workspaceApi.getWorkspaceById(
          workspaceId,
        );

      setWorkspace(data);
    } catch (error: any) {
      console.error(
        "Failed to load workspace:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to load workspace.",
        ),
        "error",
      );

      setWorkspace(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!workspaceId || !isTeacher) {
      setMembers([]);
      return;
    }

    setMembersLoading(true);

    try {
      const data =
        await workspaceApi.getWorkspaceMembers(
          workspaceId,
        );

      setMembers(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        "Failed to load members:",
        error,
      );

      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchResources = async () => {
    if (!workspaceId) {
      return;
    }

    setResourcesLoading(true);

    try {
      const data =
        await resourceApi.getResourcesByWorkspace(
          workspaceId,
        );

      setResources(
        Array.isArray(data) ? data : [],
      );
    } catch (error: any) {
      console.error(
        "Failed to load resources:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to load resources.",
        ),
        "error",
      );

      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchAssignments = async () => {
    if (!workspaceId) {
      return;
    }

    setAssignmentsLoading(true);

    try {
      const data =
        await assignmentApi.getAssignmentsByWorkspace(
          workspaceId,
        );

      setAssignments(
        Array.isArray(data) ? data : [],
      );
    } catch (error: any) {
      console.error(
        "Failed to load assignments:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to load assignments.",
        ),
        "error",
      );

      setAssignments([]);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const fetchMySubmissions = async () => {
    if (isTeacher) {
      setMySubmissions([]);
      return;
    }

    setSubmissionsLoading(true);

    try {
      const data =
        await submissionApi.getMySubmissions();

      setMySubmissions(
        Array.isArray(data) ? data : [],
      );
    } catch (error: any) {
      console.error(
        "Failed to load submissions:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to load your submissions.",
        ),
        "error",
      );

      setMySubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    fetchResources();
    fetchAssignments();

    if (!isTeacher) {
      fetchMySubmissions();
    }
  }, [workspaceId, isTeacher]);

  useEffect(() => {
    if (workspace && isTeacher) {
      fetchMembers();
    }
  }, [workspace?.id, isTeacher]);

  const handleCopyCode = async () => {
    if (!workspace?.joinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        workspace.joinCode,
      );

      setCopied(true);

      addToast(
        `Join code "${workspace.joinCode}" copied.`,
        "success",
      );

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      addToast(
        "Unable to copy join code.",
        "error",
      );
    }
  };

  const handleRegenerateCode = () => {
  if (!workspaceId || !isTeacher) {
    return;
  }

  openConfirmDialog({
    title: "Regenerate Join Code",
    description:
      "Generate a new join code? The current code will stop working immediately.",
    confirmText: "Regenerate",
    variant: "warning",
    action: async () => {
      setRegeneratingCode(true);

      try {
        const response =
          await workspaceApi.regenerateJoinCode(
            workspaceId,
          );

        if (response.joinCode) {
          setWorkspace((current) =>
            current
              ? {
                  ...current,
                  joinCode: response.joinCode!,
                }
              : current,
          );
        } else {
          await fetchWorkspace();
        }

        addToast(
          response.message ||
            "Join code regenerated.",
          "success",
        );
      } catch (error: any) {
        addToast(
          getErrorMessage(
            error,
            "Failed to regenerate join code.",
          ),
          "error",
        );

        throw error;
      } finally {
        setRegeneratingCode(false);
      }
    },
  });
};

 const handleRemoveStudent = (
  studentId: string,
) => {
  if (!workspaceId || !isTeacher) {
    return;
  }

  openConfirmDialog({
    title: "Remove Student",
    description:
      "Are you sure you want to remove this student from the classroom?",
    confirmText: "Remove",
    variant: "warning",
    action: async () => {
      try {
        await workspaceApi.removeStudent(
          workspaceId,
          studentId,
        );

        setMembers((current) =>
          current.filter(
            (member) =>
              member.studentId !== studentId,
          ),
        );

        addToast(
          "Student removed successfully.",
          "success",
        );
      } catch (error: any) {
        addToast(
          getErrorMessage(
            error,
            "Failed to remove student.",
          ),
          "error",
        );

        throw error;
      }
    },
  });
};

  const handleDeleteWorkspace = () => {
    if (!workspaceId || !isTeacher) {
      return;
    }

    openConfirmDialog({
  title: "Delete Classroom",
  description: `Are you sure you want to delete "${workspace?.name}"? This action cannot be undone.`,
  confirmText: "Delete",
  variant: "danger",
  action: async () => {
    setDeletingWorkspace(true);

    try {
      await workspaceApi.deleteWorkspace(workspaceId);

      addToast(
        "Classroom deleted successfully.",
        "success",
      );

      navigate("/teacher/dashboard");
    } catch (error: any) {
      addToast(
        getErrorMessage(
          error,
          "Failed to delete classroom.",
        ),
        "error",
      );
    } finally {
      setDeletingWorkspace(false);
    }
  },
});
 };

  const resetUploadForm = () => {
    setUploadTitle("");
    setUploadDescription("");
    setUploadFile(null);
  };

  const closeUploadModal = () => {
    if (uploading) {
      return;
    }

    setIsUploadModalOpen(false);
    resetUploadForm();
  };

  const handleUploadResource = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!workspaceId) {
      addToast(
        "Workspace ID is missing.",
        "error",
      );
      return;
    }

    if (!uploadTitle.trim()) {
      addToast(
        "Resource title is required.",
        "warning",
      );
      return;
    }

    if (!uploadFile) {
      addToast(
        "Please select a file.",
        "warning",
      );
      return;
    }

    const maximumSize =
      50 * 1024 * 1024;

    if (uploadFile.size > maximumSize) {
      addToast(
        "File size must not exceed 50 MB.",
        "error",
      );
      return;
    }

    setUploading(true);

    try {
      const createdResource =
        await resourceApi.uploadResource({
          workspaceId,
          title: uploadTitle,
          description: uploadDescription,
          file: uploadFile,
        });

      setResources((current) => [
        createdResource,
        ...current,
      ]);

      addToast(
        "Resource uploaded successfully.",
        "success",
      );

      setIsUploadModalOpen(false);
      resetUploadForm();
    } catch (error: any) {
      console.error(
        "Resource upload failed:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to upload resource.",
        ),
        "error",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = (
  resource: ResourceResponse,
) => {
  if (!isTeacher) {
    return;
  }

  openConfirmDialog({
    title: "Delete Resource",
    description: `Are you sure you want to delete "${resource.title}"? Students will no longer be able to access it.`,
    confirmText: "Delete Resource",
    variant: "danger",
    action: async () => {
      setDeletingResourceId(resource.id);

      try {
        const response =
          await resourceApi.deleteResource(
            resource.id,
          );

        setResources((current) =>
          current.filter(
            (item) =>
              item.id !== resource.id,
          ),
        );

        addToast(
          response.message ||
            "Resource deleted successfully.",
          "success",
        );
      } catch (error: any) {
        addToast(
          getErrorMessage(
            error,
            "Failed to delete resource.",
          ),
          "error",
        );
      } finally {
        setDeletingResourceId(null);
      }
    },
  });
};

  const handleOpenResource = (
    resource: ResourceResponse,
  ) => {
    if (!resource.fileUrl) {
      addToast(
        "Resource URL is unavailable.",
        "error",
      );
      return;
    }

    window.open(
      resource.fileUrl,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const toDateTimeLocalValue = (
    value: string,
  ): string => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(
      date.getTime() - offset * 60 * 1000,
    );

    return localDate.toISOString().slice(0, 16);
  };

  const resetAssignmentForm = () => {
    setEditingAssignment(null);
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentInstructions("");
    setAssignmentMaxMarks("100");
    setAssignmentDueDate("");
  };

  const openCreateAssignmentModal = () => {
    resetAssignmentForm();
    setIsAssignmentModalOpen(true);
  };

  const openEditAssignmentModal = (
    assignment: AssignmentResponse,
  ) => {
    setEditingAssignment(assignment);
    setAssignmentTitle(assignment.title);
    setAssignmentDescription(
      assignment.description || "",
    );
    setAssignmentInstructions(
      assignment.instructions || "",
    );
    setAssignmentMaxMarks(
      String(assignment.maxMarks),
    );
    setAssignmentDueDate(
      toDateTimeLocalValue(assignment.dueDate),
    );
    setIsAssignmentModalOpen(true);
  };

  const closeAssignmentModal = () => {
    if (savingAssignment) {
      return;
    }

    setIsAssignmentModalOpen(false);
    resetAssignmentForm();
  };

  const handleSaveAssignment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!workspaceId) {
      addToast(
        "Workspace ID is missing.",
        "error",
      );
      return;
    }

    const title = assignmentTitle.trim();
    const marks = Number(assignmentMaxMarks);

    if (!title) {
      addToast(
        "Assignment title is required.",
        "warning",
      );
      return;
    }

    if (
      !Number.isInteger(marks) ||
      marks <= 0
    ) {
      addToast(
        "Maximum marks must be a positive whole number.",
        "warning",
      );
      return;
    }

    if (!assignmentDueDate) {
      addToast(
        "Due date is required.",
        "warning",
      );
      return;
    }

    const dueDate = new Date(assignmentDueDate);

    if (
      Number.isNaN(dueDate.getTime()) ||
      dueDate.getTime() <= Date.now()
    ) {
      addToast(
        "Due date must be in the future.",
        "warning",
      );
      return;
    }

    setSavingAssignment(true);

    try {
      if (editingAssignment) {
        const request: UpdateAssignmentRequest = {
          title,
          description:
            assignmentDescription.trim(),
          instructions:
            assignmentInstructions.trim(),
          maxMarks: marks,
          dueDate:
            dueDate.toISOString().slice(0, 19),
        };

        const updated =
          await assignmentApi.updateAssignment(
            editingAssignment.id,
            request,
          );

        setAssignments((current) =>
          current.map((assignment) =>
            assignment.id === updated.id
              ? updated
              : assignment,
          ),
        );

        addToast(
          "Assignment updated successfully.",
          "success",
        );
      } else {
        const request: CreateAssignmentRequest = {
          workspaceId,
          title,
          description:
            assignmentDescription.trim(),
          instructions:
            assignmentInstructions.trim(),
          maxMarks: marks,
          dueDate:
            dueDate.toISOString().slice(0, 19),
        };

        const created =
          await assignmentApi.createAssignment(
            request,
          );

        setAssignments((current) => [
          created,
          ...current,
        ]);

        addToast(
          "Assignment created successfully.",
          "success",
        );
      }

      setIsAssignmentModalOpen(false);
      resetAssignmentForm();
    } catch (error: any) {
      console.error(
        "Failed to save assignment:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          editingAssignment
            ? "Failed to update assignment."
            : "Failed to create assignment.",
        ),
        "error",
      );
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleDeleteAssignment = (
  assignment: AssignmentResponse,
) => {
  if (!isTeacher) {
    return;
  }

  openConfirmDialog({
    title: "Delete Assignment",
    description: `Delete "${assignment.title}"? This will also remove all related submissions.`,
    confirmText: "Delete Assignment",
    variant: "danger",
    action: async () => {
      setDeletingAssignmentId(
        assignment.id,
      );

      try {
        const response =
          await assignmentApi.deleteAssignment(
            assignment.id,
          );

        setAssignments((current) =>
          current.filter(
            (item) =>
              item.id !== assignment.id,
          ),
        );

        addToast(
          response.message ||
            "Assignment deleted successfully.",
          "success",
        );
      } catch (error: any) {
        addToast(
          getErrorMessage(
            error,
            "Failed to delete assignment.",
          ),
          "error",
        );
      } finally {
        setDeletingAssignmentId(
          null,
        );
      }
    },
  });
};

  const formatDueDate = (
    value: string,
  ): string => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const isAssignmentOverdue = (
    value: string,
  ): boolean => {
    return new Date(value).getTime() < Date.now();
  };

  const findSubmissionForAssignment = (
    assignmentId: string,
  ): SubmissionResponse | undefined => {
    return mySubmissions.find(
      (submission) =>
        submission.assignmentId === assignmentId,
    );
  };

  const openSubmissionModal = (
    assignment: AssignmentResponse,
  ) => {
    const existingSubmission =
      findSubmissionForAssignment(
        assignment.id,
      );

    setSelectedAssignment(assignment);
    setSubmissionContent(
      existingSubmission?.content || "",
    );
    setSubmissionAttachmentUrl(
      existingSubmission?.attachmentUrl || "",
    );
    setIsSubmissionModalOpen(true);
  };

  const closeSubmissionModal = () => {
    if (savingSubmission) {
      return;
    }

    setIsSubmissionModalOpen(false);
    setSelectedAssignment(null);
    setSubmissionContent("");
    setSubmissionAttachmentUrl("");
  };

  const handleSaveSubmission = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedAssignment) {
      addToast(
        "Assignment is missing.",
        "error",
      );
      return;
    }

    const content = submissionContent.trim();

    if (!content) {
      addToast(
        "Submission content is required.",
        "warning",
      );
      return;
    }

    const existingSubmission =
      findSubmissionForAssignment(
        selectedAssignment.id,
      );

    setSavingSubmission(true);

    try {
      let savedSubmission: SubmissionResponse;

      if (existingSubmission) {
        savedSubmission =
          await submissionApi.updateSubmission(
            existingSubmission.id,
            {
              content,
              attachmentUrl:
                submissionAttachmentUrl.trim(),
            },
          );

        setMySubmissions((current) =>
          current.map((submission) =>
            submission.id ===
            savedSubmission.id
              ? savedSubmission
              : submission,
          ),
        );

        addToast(
          "Submission updated successfully.",
          "success",
        );
      } else {
        savedSubmission =
          await submissionApi.createSubmission({
            assignmentId:
              selectedAssignment.id,
            content,
            attachmentUrl:
              submissionAttachmentUrl.trim(),
          });

        setMySubmissions((current) => [
          savedSubmission,
          ...current,
        ]);

        addToast(
          "Assignment submitted successfully.",
          "success",
        );
      }

      closeSubmissionModal();
    } catch (error: any) {
      console.error(
        "Failed to save submission:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          existingSubmission
            ? "Failed to update submission."
            : "Failed to submit assignment.",
        ),
        "error",
      );
    } finally {
      setSavingSubmission(false);
    }
  };

  const handleDeleteSubmission = (
  submission: SubmissionResponse,
) => {
  openConfirmDialog({
    title: "Delete Submission",
    description:
      "Are you sure you want to delete this submission?",
    confirmText: "Delete Submission",
    variant: "danger",
    action: async () => {
      setDeletingSubmissionId(
        submission.id,
      );

      try {
        const response =
          await submissionApi.deleteSubmission(
            submission.id,
          );

        setMySubmissions((current) =>
          current.filter(
            (item) =>
              item.id !== submission.id,
          ),
        );

        addToast(
          response.message ||
            "Submission deleted successfully.",
          "success",
        );
      } catch (error: any) {
        addToast(
          getErrorMessage(
            error,
            "Failed to delete submission.",
          ),
          "error",
        );
      } finally {
        setDeletingSubmissionId(
          null,
        );
      }
    },
  });
};

  const initializeGradeDrafts = (
    submissions: SubmissionResponse[],
  ) => {
    setGradeDrafts((current) => {
      const next = { ...current };

      submissions.forEach((submission) => {
        if (!next[submission.id]) {
          next[submission.id] = {
            marksObtained:
              submission.marksObtained?.toString() ||
              "",
            feedback:
              submission.feedback || "",
          };
        }
      });

      return next;
    });
  };

  const fetchTeacherSubmissions = async (
    assignmentId: string,
  ) => {
    setTeacherSubmissionsLoadingId(
      assignmentId,
    );

    try {
      const data =
        await submissionApi.getSubmissionsByAssignment(
          assignmentId,
        );

      const submissions = Array.isArray(data)
        ? data
        : [];

      setTeacherSubmissions((current) => ({
        ...current,
        [assignmentId]: submissions,
      }));

      initializeGradeDrafts(submissions);
    } catch (error: any) {
      console.error(
        "Failed to load assignment submissions:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to load student submissions.",
        ),
        "error",
      );

      setTeacherSubmissions((current) => ({
        ...current,
        [assignmentId]: [],
      }));
    } finally {
      setTeacherSubmissionsLoadingId(null);
    }
  };

  const toggleTeacherSubmissions = async (
    assignmentId: string,
  ) => {
    if (
      expandedSubmissionAssignmentId ===
      assignmentId
    ) {
      setExpandedSubmissionAssignmentId(
        null,
      );
      return;
    }

    setExpandedSubmissionAssignmentId(
      assignmentId,
    );

    await fetchTeacherSubmissions(
      assignmentId,
    );
  };

  const updateGradeDraft = (
    submissionId: string,
    field:
      | "marksObtained"
      | "feedback",
    value: string,
  ) => {
    setGradeDrafts((current) => ({
      ...current,
      [submissionId]: {
        marksObtained:
          current[submissionId]
            ?.marksObtained || "",
        feedback:
          current[submissionId]?.feedback ||
          "",
        [field]: value,
      },
    }));
  };

  const handleGradeSubmission = async (
    assignment: AssignmentResponse,
    submission: SubmissionResponse,
  ) => {
    const draft =
      gradeDrafts[submission.id];

    const marksObtained = Number(
      draft?.marksObtained,
    );

    if (
      !draft?.marksObtained.trim() ||
      Number.isNaN(marksObtained)
    ) {
      addToast(
        "Enter valid marks.",
        "warning",
      );
      return;
    }

    if (marksObtained < 0) {
      addToast(
        "Marks cannot be negative.",
        "warning",
      );
      return;
    }

    if (
      marksObtained >
      assignment.maxMarks
    ) {
      addToast(
        `Marks cannot exceed ${assignment.maxMarks}.`,
        "warning",
      );
      return;
    }

    setGradingSubmissionId(
      submission.id,
    );

    try {
      const gradedSubmission =
        await submissionApi.gradeSubmission(
          submission.id,
          {
            marksObtained,
            feedback:
              draft.feedback.trim(),
          },
        );

      setTeacherSubmissions((current) => ({
        ...current,
        [assignment.id]: (
          current[assignment.id] || []
        ).map((item) =>
          item.id ===
          gradedSubmission.id
            ? gradedSubmission
            : item,
        ),
      }));

      setGradeDrafts((current) => ({
        ...current,
        [gradedSubmission.id]: {
          marksObtained:
            gradedSubmission.marksObtained?.toString() ||
            "",
          feedback:
            gradedSubmission.feedback || "",
        },
      }));

      addToast(
        "Submission graded successfully.",
        "success",
      );
    } catch (error: any) {
      console.error(
        "Failed to grade submission:",
        error,
      );

      addToast(
        getErrorMessage(
          error,
          "Failed to grade submission.",
        ),
        "error",
      );
    } finally {
      setGradingSubmissionId(null);
    }
  };

  const formatFileSize = (
    bytes: number | null | undefined,
  ): string => {
    if (!bytes || bytes <= 0) {
      return "Unknown size";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  const formatDate = (
    dateValue: string,
  ): string => {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  };

  const getResourceIcon = (
    resourceType: ResourceType,
  ) => {
    switch (resourceType) {
      case "IMAGE":
        return (
          <FileImage className="w-5 h-5" />
        );

      case "VIDEO":
        return (
          <FileVideo className="w-5 h-5" />
        );

      case "PDF":
        return (
          <FileText className="w-5 h-5" />
        );

      case "PRESENTATION":
        return (
          <Presentation className="w-5 h-5" />
        );

      case "ARCHIVE":
        return (
          <FolderArchive className="w-5 h-5" />
        );

      case "DOCUMENT":
        return (
          <FileText className="w-5 h-5" />
        );

      default:
        return <File className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-52 rounded bg-zinc-900 animate-pulse" />

        <div className="h-36 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse" />
          <div className="h-44 rounded-xl border border-zinc-800 bg-zinc-900/40 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!workspace) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
      <BookOpen className="mx-auto mb-3 h-9 w-9 text-zinc-500" />

      <h1 className="text-lg font-semibold text-zinc-100">
        Workspace unavailable
      </h1>

      <p className="mt-2 text-sm text-zinc-500">
        The workspace does not exist or you cannot access it.
      </p>

      <Link
        to={
          isTeacher
            ? "/teacher/dashboard"
            : "/student/dashboard"
        }
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}

const currentWorkspace = workspace;

return (
  <div className="space-y-6">
    {/* Back navigation */}
    <motion.div
      initial={{
        opacity: 0,
        x: -8,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.35,
      }}
    >
      <Link
        to={
          isTeacher
            ? "/teacher/dashboard"
            : "/student/dashboard"
        }
        className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>
    </motion.div>

    {/* Workspace hero */}
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-8"
    >
      {/* Blueprint background */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(9,9,11,0.84)_86%)]" />
      </div>

      {/* Decorative glows */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#A855F7]/15 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          {/* Workspace information */}
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A855F7]/25 bg-[#A855F7]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-purple-200">
                <BookOpen className="h-3 w-3 text-[#C084FC]" />
                {currentWorkspace.subject}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-medium ${
                  currentWorkspace.active
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.04] text-zinc-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    currentWorkspace.active
                      ? "bg-emerald-400"
                      : "bg-zinc-600"
                  }`}
                />

                {currentWorkspace.active
                  ? "Active Classroom"
                  : "Inactive Classroom"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium text-zinc-400">
                <Users className="h-3 w-3" />

                {isTeacher
                  ? `${members.length} ${
                      members.length === 1
                        ? "student"
                        : "students"
                    }`
                  : "Enrolled Student"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
              {currentWorkspace.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              {currentWorkspace.description ||
                "A collaborative classroom for learning resources, assignments, submissions, and student progress."}
            </p>

            {/* Workspace statistics */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-500">
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">
                    Resources
                  </span>
                </div>

                <p className="mt-2 font-mono text-xl font-semibold text-white">
                  {resources.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                <div className="flex items-center gap-2 text-zinc-500">
                  <ClipboardList className="h-3.5 w-3.5 text-amber-400" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">
                    Assignments
                  </span>
                </div>

                <p className="mt-2 font-mono text-xl font-semibold text-white">
                  {assignments.length}
                </p>
              </div>

              <div className="col-span-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 sm:col-span-1">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users className="h-3.5 w-3.5 text-emerald-400" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">
                    Your Role
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-white">
                  {isTeacher ? "Teacher" : "Student"}
                </p>
              </div>
            </div>
          </div>

          {/* Join code panel */}
          <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-[0_14px_45px_rgba(0,0,0,0.2)] lg:w-[310px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Class Join Code
                </span>

                <p className="mt-1 text-[11px] text-zinc-600">
                  {isTeacher
                    ? "Share this code with students"
                    : "Classroom reference code"}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#A855F7]/20 bg-[#A855F7]/10 text-purple-300">
                <Copy className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-900/90 p-3.5">
              <span className="min-w-0 truncate font-mono text-lg font-semibold tracking-[0.16em] text-zinc-100">
                {currentWorkspace.joinCode}
              </span>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-semibold text-zinc-400 transition-all hover:border-[#A855F7]/35 hover:bg-[#A855F7]/10 hover:text-purple-200"
                title="Copy join code"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {isTeacher && (
              <button
                type="button"
                onClick={handleRegenerateCode}
                disabled={regeneratingCode}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-zinc-300 transition-all hover:border-[#A855F7]/30 hover:bg-[#A855F7]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    regeneratingCode
                      ? "animate-spin"
                      : ""
                  }`}
                />

                {regeneratingCode
                  ? "Generating New Code..."
                  : "Regenerate Join Code"}
              </button>
            )}

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="flex items-center gap-2 text-[10px] text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" />

                Created{" "}
                {currentWorkspace.createdAt
                  ? formatDate(
                      currentWorkspace.createdAt,
                    )
                  : "recently"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

     <motion.section
  initial={{
    opacity: 0,
    y: 14,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 0.4,
    delay: 0.08,
  }}
  className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6"
>
  {/* Decorative glow */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-indigo-500/10 blur-[70px]" />

  <div className="relative z-10">
    {/* Section header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-white">
              Learning Resources
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {resources.length} resource
              {resources.length === 1 ? "" : "s"} available
            </p>
          </div>
        </div>
      </div>

      {isTeacher && (
        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-[#A855F7] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 hover:shadow-[0_14px_38px_rgba(99,102,241,0.32)] active:translate-y-0"
        >
          <Upload className="h-4 w-4" />
          Upload Resource
        </button>
      )}
    </div>

    {/* Loading */}
    {resourcesLoading ? (
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="min-h-[190px] animate-pulse rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
          >
            <div className="flex gap-3">
              <div className="h-11 w-11 rounded-xl bg-zinc-800" />

              <div className="flex-1">
                <div className="h-4 w-2/3 rounded bg-zinc-800" />
                <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800/80" />
              </div>
            </div>

            <div className="mt-5 h-3 w-full rounded bg-zinc-800/70" />
            <div className="mt-2 h-3 w-3/4 rounded bg-zinc-800/70" />
            <div className="mt-8 h-10 w-full rounded-xl bg-zinc-800" />
          </div>
        ))}
      </div>
    ) : resources.length === 0 ? (
      /* Empty state */
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-dashed border-zinc-700 bg-black/20 p-10 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[60px]" />

        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
            <BookOpen className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-zinc-100">
            No resources uploaded yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
            {isTeacher
              ? "Upload notes, PDFs, presentations, videos, or other learning material for your students."
              : "Your teacher has not uploaded any learning resources yet."}
          </p>

          {isTeacher && (
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-4 py-2.5 text-xs font-semibold text-indigo-100 transition-all hover:border-indigo-400/40 hover:bg-indigo-400/15 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Upload First Resource
            </button>
          )}
        </div>
      </div>
    ) : (
      /* Resource grid */
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {resources.map((resource, index) => (
          <motion.article
            key={resource.id}
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.12 + index * 0.04,
            }}
            whileHover={{
              y: -4,
            }}
            className="group relative flex min-h-[210px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/65 p-5 transition-all duration-300 hover:border-indigo-400/30 hover:shadow-[0_18px_50px_rgba(99,102,241,0.1)]"
          >
            {/* Top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Card glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-[55px] transition-all duration-500 group-hover:bg-indigo-500/18" />

            <div className="relative z-10 flex flex-1 flex-col">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                  {getResourceIcon(resource.resourceType)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-zinc-100">
                        {resource.title}
                      </h3>

                      <p className="mt-1 truncate text-[11px] text-zinc-500">
                        {resource.originalFileName}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-indigo-200">
                      {resource.resourceType}
                    </span>
                  </div>

                  <p className="mt-3 min-h-[40px] line-clamp-2 text-xs leading-5 text-zinc-500">
                    {resource.description ||
                      "Learning material shared for this classroom."}
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                  {formatFileSize(resource.fileSize)}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                  {formatDate(resource.createdAt)}
                </span>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-5">
                <button
                  type="button"
                  onClick={() => handleOpenResource(resource)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-3 py-2.5 text-xs font-semibold text-indigo-100 transition-all duration-200 hover:border-indigo-400/40 hover:bg-indigo-400/15 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Resource
                </button>

                {isTeacher && (
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(resource)}
                    disabled={deletingResourceId === resource.id}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.06] text-red-400 transition-all hover:border-red-500/35 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Delete resource"
                  >
                    {deletingResourceId === resource.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    )}
  </div>
</motion.section>

      <motion.section
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.12 }}
  className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6"
>
  {/* Decorative glow */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-500/10 blur-[70px]" />

  <div className="relative z-10">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
          <ClipboardList className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            Assignments
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            {assignments.length} assignment
            {assignments.length === 1 ? "" : "s"} available
          </p>
        </div>
      </div>

      {isTeacher && (
        <button
          type="button"
          onClick={openCreateAssignmentModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-[#A855F7] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(99,102,241,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-purple-500 hover:shadow-[0_14px_38px_rgba(99,102,241,0.32)]"
        >
          <Plus className="h-4 w-4" />
          Create Assignment
        </button>
      )}
    </div>

    {/* Loading */}
    {assignmentsLoading ? (
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="min-h-[220px] animate-pulse rounded-2xl border border-white/10 bg-zinc-900/50 p-5"
          >
            <div className="flex gap-3">
              <div className="h-11 w-11 rounded-xl bg-zinc-800" />

              <div className="flex-1">
                <div className="h-4 w-2/3 rounded bg-zinc-800" />
                <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800/80" />
              </div>
            </div>

            <div className="mt-5 h-3 w-full rounded bg-zinc-800/70" />
            <div className="mt-2 h-3 w-3/4 rounded bg-zinc-800/70" />
            <div className="mt-8 h-10 w-full rounded-xl bg-zinc-800" />
          </div>
        ))}
      </div>
    ) : assignments.length === 0 ? (
      /* Empty state */
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-dashed border-zinc-700 bg-black/20 p-10 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[60px]" />

        <div className="relative">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <ClipboardList className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-zinc-100">
            No assignments created yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
            {isTeacher
              ? "Create an assignment with instructions, a deadline, and maximum marks for your students."
              : "Your teacher has not created any assignments yet."}
          </p>

          {isTeacher && (
            <button
              type="button"
              onClick={openCreateAssignmentModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-xs font-semibold text-amber-100 transition-all hover:border-amber-400/40 hover:bg-amber-400/15 hover:text-white"
            >
              <Plus className="h-4 w-4" />
              Create First Assignment
            </button>
          )}
        </div>
      </div>
    ) : (
      /* Assignment grid */
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {assignments.map((assignment, index) => {
          const overdue = isAssignmentOverdue(
            assignment.dueDate,
          );

          return (
            <motion.article
              key={assignment.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.14 + index * 0.04,
              }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/65 p-5 transition-all duration-300 hover:border-amber-400/25 hover:shadow-[0_18px_50px_rgba(245,158,11,0.08)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-[55px]" />

              <div className="relative z-10">
                {/* Assignment information */}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                    <ClipboardList className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold leading-5 text-zinc-100">
                        {assignment.title}
                      </h3>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${
                          overdue
                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                            : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            overdue
                              ? "bg-red-400"
                              : "bg-emerald-400"
                          }`}
                        />

                        {overdue ? "Overdue" : "Active"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                      {assignment.description ||
                        "No assignment description provided."}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                {assignment.instructions && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                      Instructions
                    </p>

                    <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-zinc-400">
                      {assignment.instructions}
                    </p>
                  </div>
                )}

                {/* Assignment metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] ${
                      overdue
                        ? "border-red-500/20 bg-red-500/[0.06] text-red-300"
                        : "border-white/10 bg-white/[0.03] text-zinc-400"
                    }`}
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    Due {formatDueDate(assignment.dueDate)}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-400">
                    {assignment.maxMarks} marks
                  </span>
                </div>

                {/* Student submission area */}
                {!isTeacher && (
                  <div className="mt-5 border-t border-white/10 pt-5">
                    {submissionsLoading ? (
                      <div className="h-11 animate-pulse rounded-xl bg-zinc-800/50" />
                    ) : (
                      (() => {
                        const submission =
                          findSubmissionForAssignment(
                            assignment.id,
                          );

                        if (!submission) {
                          return (
                            <button
                              type="button"
                              onClick={() =>
                                openSubmissionModal(
                                  assignment,
                                )
                              }
                              disabled={overdue}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-[#A855F7] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(99,102,241,0.18)] transition-all hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Send className="h-4 w-4" />

                              {overdue
                                ? "Deadline Passed"
                                : "Submit Assignment"}
                            </button>
                          );
                        }

                        return (
                          <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${
                                  submission.status ===
                                  "GRADED"
                                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                    : "border-blue-400/20 bg-blue-400/10 text-blue-300"
                                }`}
                              >
                                {submission.status}
                              </span>

                              {submission.status ===
                                "GRADED" && (
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                                  {submission.marksObtained ??
                                    0}{" "}
                                  / {assignment.maxMarks}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                              <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-zinc-400">
                                {submission.content}
                              </p>
                            </div>

                            {submission.attachmentUrl && (
                              <a
                                href={
                                  submission.attachmentUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open attachment
                              </a>
                            )}

                            {submission.feedback && (
                              <div className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] p-3">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-400">
                                  Teacher Feedback
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                                  {submission.feedback}
                                </p>
                              </div>
                            )}

                            {submission.status !==
                              "GRADED" && (
                              <div className="mt-4 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openSubmissionModal(
                                      assignment,
                                    )
                                  }
                                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/[0.08] hover:text-white"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Update
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteSubmission(
                                      submission,
                                    )
                                  }
                                  disabled={
                                    deletingSubmissionId ===
                                    submission.id
                                  }
                                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.06] text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
                                  title="Delete submission"
                                >
                                  {deletingSubmissionId ===
                                  submission.id ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

                {/* Teacher actions */}
                {isTeacher && (
                  <>
                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-5">
                      <button
                        type="button"
                        onClick={() =>
                          toggleTeacherSubmissions(
                            assignment.id,
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/[0.07] px-3 py-2.5 text-xs font-semibold text-indigo-300 transition-all hover:border-indigo-400/35 hover:bg-indigo-400/12"
                      >
                        {teacherSubmissionsLoadingId ===
                        assignment.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <UserRoundCheck className="h-4 w-4" />
                        )}

                        {expandedSubmissionAssignmentId ===
                        assignment.id
                          ? "Hide Submissions"
                          : "View Submissions"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditAssignmentModal(
                            assignment,
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-white/[0.08] hover:text-white"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteAssignment(
                          assignment,
                        )
                      }
                      disabled={
                        deletingAssignmentId ===
                        assignment.id
                      }
                      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-3 py-2.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deletingAssignmentId ===
                      assignment.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      Delete Assignment
                    </button>

                    {/* Expanded teacher submissions */}
                    {expandedSubmissionAssignmentId ===
                      assignment.id && (
                      <div className="mt-5 border-t border-white/10 pt-5">
                        {teacherSubmissionsLoadingId ===
                        assignment.id ? (
                          <div className="space-y-3">
                            {[1, 2].map((item) => (
                              <div
                                key={item}
                                className="h-32 animate-pulse rounded-xl bg-zinc-900"
                              />
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-zinc-200">
                                  Student Submissions
                                </p>

                                <p className="mt-1 text-[10px] text-zinc-500">
                                  {
                                    (
                                      teacherSubmissions[
                                        assignment.id
                                      ] || []
                                    ).length
                                  }{" "}
                                  received
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  fetchTeacherSubmissions(
                                    assignment.id,
                                  )
                                }
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-500 transition-all hover:bg-white/[0.08] hover:text-zinc-200"
                                title="Refresh submissions"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {(
                              teacherSubmissions[
                                assignment.id
                              ] || []
                            ).length === 0 ? (
                              <div className="rounded-xl border border-dashed border-zinc-700 bg-black/20 p-6 text-center">
                                <UserRoundCheck className="mx-auto h-6 w-6 text-zinc-600" />

                                <p className="mt-3 text-xs text-zinc-500">
                                  No student has submitted this
                                  assignment yet.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {(
                                  teacherSubmissions[
                                    assignment.id
                                  ] || []
                                ).map((submission) => {
                                  const draft =
                                    gradeDrafts[
                                      submission.id
                                    ] || {
                                      marksObtained:
                                        submission.marksObtained?.toString() ||
                                        "",
                                      feedback:
                                        submission.feedback ||
                                        "",
                                    };

                                  return (
                                    <div
                                      key={submission.id}
                                      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
                                    >
                                      <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                                            Student ID
                                          </p>

                                          <p className="mt-1 break-all font-mono text-xs text-zinc-300">
                                            {
                                              submission.studentId
                                            }
                                          </p>
                                        </div>

                                        <span
                                          className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] ${
                                            submission.status ===
                                            "GRADED"
                                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                              : "border-blue-400/20 bg-blue-400/10 text-blue-300"
                                          }`}
                                        >
                                          {submission.status}
                                        </span>
                                      </div>

                                      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-4">
                                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                                          Answer
                                        </p>

                                        <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                                          {submission.content}
                                        </p>
                                      </div>

                                      {submission.attachmentUrl && (
                                        <a
                                          href={
                                            submission.attachmentUrl
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                                        >
                                          <ExternalLink className="h-3.5 w-3.5" />
                                          Open attachment
                                        </a>
                                      )}

                                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div>
                                          <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                                            Marks
                                          </label>

                                          <input
                                            type="number"
                                            min={0}
                                            max={
                                              assignment.maxMarks
                                            }
                                            value={
                                              draft.marksObtained
                                            }
                                            onChange={(event) =>
                                              updateGradeDraft(
                                                submission.id,
                                                "marksObtained",
                                                event.target
                                                  .value,
                                              )
                                            }
                                            placeholder={`0-${assignment.maxMarks}`}
                                            className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
                                          />
                                        </div>

                                        <div className="sm:col-span-2">
                                          <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                                            Feedback
                                          </label>

                                          <textarea
                                            rows={3}
                                            value={
                                              draft.feedback
                                            }
                                            onChange={(event) =>
                                              updateGradeDraft(
                                                submission.id,
                                                "feedback",
                                                event.target
                                                  .value,
                                              )
                                            }
                                            placeholder="Add feedback for the student..."
                                            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
                                          />
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleGradeSubmission(
                                            assignment,
                                            submission,
                                          )
                                        }
                                        disabled={
                                          gradingSubmissionId ===
                                          submission.id
                                        }
                                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
                                      >
                                        {gradingSubmissionId ===
                                        submission.id ? (
                                          <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Saving Grade...
                                          </>
                                        ) : (
                                          <>
                                            <Check className="h-4 w-4" />

                                            {submission.status ===
                                            "GRADED"
                                              ? "Update Grade"
                                              : "Grade Submission"}
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    )}
  </div>
</motion.section>

      <motion.section
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.16 }}
  className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/45 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-6"
>
  {/* Decorative glow */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-500/10 blur-[70px]" />

  <div className="relative z-10">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <Users className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">
            Members
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            {isTeacher
              ? `${members.length} enrolled student${
                  members.length === 1 ? "" : "s"
                }`
              : "Classroom membership"}
          </p>
        </div>
      </div>

      {isTeacher && (
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
          {members.length} Students
        </span>
      )}
    </div>

    {/* Student View */}
    {!isTeacher ? (
      <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <Check className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              You're enrolled
            </h3>

            <p className="mt-1 text-xs text-zinc-400">
              You are an active member of this classroom.
            </p>
          </div>
        </div>
      </div>
    ) : membersLoading ? (
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 animate-pulse"
          >
            <div className="h-12 w-12 rounded-full bg-zinc-800" />

            <div className="flex-1">
              <div className="h-4 w-40 rounded bg-zinc-800" />
              <div className="mt-2 h-3 w-56 rounded bg-zinc-800/70" />
            </div>
          </div>
        ))}
      </div>
    ) : members.length === 0 ? (
      <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 bg-black/20 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
          <Users className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">
          No students yet
        </h3>

        <p className="mt-2 text-xs text-zinc-500">
          Share your classroom join code so students can enroll.
        </p>
      </div>
    ) : (
      <div className="mt-6 space-y-3">
        {members.map((member, index) => (
          <motion.div
            key={member.membershipId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.04,
            }}
            whileHover={{ y: -2 }}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition-all hover:border-emerald-400/25 hover:shadow-[0_12px_35px_rgba(16,185,129,0.08)]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white">
                {(member.studentName || "S")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-white">
                  {member.studentName ||
                    "Unknown Student"}
                </h3>

                <p className="mt-1 truncate text-xs text-zinc-500">
                  {member.studentEmail ||
                    member.studentId}
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                  Joined{" "}
                  {new Date(
                    member.joinedAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleRemoveStudent(
                  member.studentId,
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.05] text-red-400 transition-all hover:border-red-500/35 hover:bg-red-500/10 hover:text-red-300"
              title="Remove student"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    )}
  </div>
</motion.section>

      {isTeacher && (
        <section className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/30 to-zinc-950 p-6 shadow-[0_18px_55px_rgba(127,29,29,0.18)]">
          <h2 className="text-base font-semibold text-red-300">
            Danger Zone
          </h2>

          <button
            type="button"
            onClick={handleDeleteWorkspace}
            disabled={deletingWorkspace}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition-all duration-200 hover:border-red-400 hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />

            {deletingWorkspace
              ? "Deleting..."
              : "Delete Classroom"}
          </button>
        </section>
      )}

      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeUploadModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-zinc-100">
                    Upload Resource
                  </h2>

                  <p className="text-xs text-zinc-500 mt-1">
                    Maximum file size: 50 MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                  className="rounded-lg p-2 text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleUploadResource}
                className="space-y-4 mt-5"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Resource title
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={uploadTitle}
                    onChange={(event) =>
                      setUploadTitle(
                        event.target.value,
                      )
                    }
                    placeholder="Example: Java OOP Notes"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={uploadDescription}
                    onChange={(event) =>
                      setUploadDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Optional description"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-xs text-zinc-100 resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    File
                  </label>

                  <input
                    type="file"
                    required
                    onChange={(event) =>
                      setUploadFile(
                        event.target.files?.[0] ||
                          null,
                      )
                    }
                    className="block w-full text-sm text-zinc-400 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-violet-600 file:text-white file:text-sm file:hover:bg-violet-400 file:transition-colors file:font-medium"
                  />

                  {uploadFile && (
                    <p className="text-[11px] text-zinc-500 mt-2">
                      {uploadFile.name} —{" "}
                      {formatFileSize(
                        uploadFile.size,
                      )}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeUploadModal}
                    disabled={uploading}
                    className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"                  >
                    {uploading ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {isAssignmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAssignmentModal}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-700/80 bg-zinc-950 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-zinc-100">
                    {editingAssignment
                      ? "Edit Assignment"
                      : "Create Assignment"}
                  </h2>

                  <p className="mt-1.5 max-w-md text-xs leading-5 text-zinc-500">
                    Add assignment details, marks,
                    instructions and a future due date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAssignmentModal}
                  disabled={savingAssignment}
                  className="rounded-lg p-2 text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSaveAssignment}
                className="space-y-4 mt-5"
              >
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Assignment title
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={assignmentTitle}
                    onChange={(event) =>
                      setAssignmentTitle(
                        event.target.value,
                      )
                    }
                    placeholder="Example: Java OOP Assignment"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={assignmentDescription}
                    onChange={(event) =>
                      setAssignmentDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Short assignment overview"
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-300">
                    Instructions
                  </label>

                  <textarea
                    rows={5}
                    maxLength={5000}
                    value={assignmentInstructions}
                    onChange={(event) =>
                      setAssignmentInstructions(
                        event.target.value,
                      )
                    }
                    placeholder="Explain what students must complete and submit"
                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Maximum marks
                    </label>

                    <input
                      type="number"
                      required
                      min={1}
                      step={1}
                      value={assignmentMaxMarks}
                      onChange={(event) =>
                        setAssignmentMaxMarks(
                          event.target.value,
                        )
                      }
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Due date
                    </label>

                    <input
                      type="datetime-local"
                      required
                      value={assignmentDueDate}
                      onChange={(event) =>
                        setAssignmentDueDate(
                          event.target.value,
                        )
                      }
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeAssignmentModal}
                    disabled={savingAssignment}
                    className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingAssignment}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingAssignment ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {editingAssignment
                          ? "Update Assignment"
                          : "Create Assignment"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isSubmissionModalOpen &&
          selectedAssignment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSubmissionModal}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.97,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  y: 10,
                }}
                className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-700/80 bg-zinc-950 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100">
                      {findSubmissionForAssignment(
                        selectedAssignment.id,
                      )
                        ? "Update Submission"
                        : "Submit Assignment"}
                    </h2>

                    <p className="text-xs text-zinc-500 mt-1">
                      {selectedAssignment.title}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeSubmissionModal}
                    disabled={savingSubmission}
                    className="rounded-lg p-2 text-zinc-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={handleSaveSubmission}
                  className="space-y-4 mt-5"
                >
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Your answer
                    </label>

                    <textarea
                      rows={8}
                      required
                      value={submissionContent}
                      onChange={(event) =>
                        setSubmissionContent(
                          event.target.value,
                        )
                      }
                      placeholder="Write your solution or submission details..."
                      className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Attachment URL
                      <span className="text-zinc-500 ml-1">
                        (optional)
                      </span>
                    </label>

                    <input
                      type="url"
                      value={
                        submissionAttachmentUrl
                      }
                      onChange={(event) =>
                        setSubmissionAttachmentUrl(
                          event.target.value,
                        )
                      }
                      placeholder="https://drive.google.com/... or GitHub URL"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4 text-sm text-zinc-300">
                    Due{" "}
                    {formatDueDate(
                      selectedAssignment.dueDate,
                    )}{" "}
                    ·{" "}
                    {selectedAssignment.maxMarks}{" "}
                    marks
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeSubmissionModal}
                      disabled={savingSubmission}
                      className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={savingSubmission}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingSubmission ? (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {findSubmissionForAssignment(
                            selectedAssignment.id,
                          )
                            ? "Update Submission"
                            : "Submit Assignment"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

      </AnimatePresence>
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
        loading={confirmDialogLoading}
        onConfirm={executeConfirmAction}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
};