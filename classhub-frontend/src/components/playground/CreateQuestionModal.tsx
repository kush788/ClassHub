import {
  Check,
  Code2,
  LoaderCircle,
  X,
} from "lucide-react";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CodingQuestion,
  CreateCodingQuestionRequest,
  ProgrammingLanguage,
  UpdateCodingQuestionRequest,
} from "../../api/playgroundApi";

interface QuestionModalProps {
  open: boolean;
  workspaceId: string;
  saving: boolean;
  question?: CodingQuestion | null;
  onClose: () => void;

  onCreate: (
    request: CreateCodingQuestionRequest,
  ) => Promise<void>;

  onUpdate: (
    questionId: string,
    request: UpdateCodingQuestionRequest,
  ) => Promise<void>;
}

const languageOptions: Array<{
  value: ProgrammingLanguage;
  label: string;
}> = [
  {
    value: "JAVA",
    label: "Java",
  },
  {
    value: "PYTHON",
    label: "Python",
  },
  {
    value: "C",
    label: "C",
  },
  {
    value: "CPP",
    label: "C++",
  },
];

export default function CreateQuestionModal({
  open,
  workspaceId,
  saving,
  question,
  onClose,
  onCreate,
  onUpdate,
}: QuestionModalProps) {
  const isEditing = Boolean(question);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [sampleInput, setSampleInput] =
    useState("");

  const [sampleOutput, setSampleOutput] =
    useState("");

  const [
    allowedLanguages,
    setAllowedLanguages,
  ] = useState<ProgrammingLanguage[]>([
    "JAVA",
    "PYTHON",
  ]);

  const [active, setActive] =
    useState(true);

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (question) {
      setTitle(question.title);
      setDescription(question.description);
      setSampleInput(
        question.sampleInput || "",
      );
      setSampleOutput(
        question.sampleOutput || "",
      );
      setAllowedLanguages(
        question.allowedLanguages,
      );
      setActive(question.active);
    } else {
      setTitle("");
      setDescription("");
      setSampleInput("");
      setSampleOutput("");
      setAllowedLanguages([
        "JAVA",
        "PYTHON",
      ]);
      setActive(true);
    }

    setFormError("");
  }, [open, question]);

  if (!open) {
    return null;
  }

  const toggleLanguage = (
    language: ProgrammingLanguage,
  ) => {
    setAllowedLanguages((current) =>
      current.includes(language)
        ? current.filter(
            (item) => item !== language,
          )
        : [...current, language],
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedTitle =
      title.trim();

    const normalizedDescription =
      description.trim();

    if (!normalizedTitle) {
      setFormError(
        "Question title is required.",
      );
      return;
    }

    if (!normalizedDescription) {
      setFormError(
        "Question description is required.",
      );
      return;
    }

    if (allowedLanguages.length === 0) {
      setFormError(
        "Select at least one programming language.",
      );
      return;
    }

    setFormError("");

    if (question) {
      await onUpdate(question.id, {
        title: normalizedTitle,
        description:
          normalizedDescription,
        sampleInput:
          sampleInput.trim(),
        sampleOutput:
          sampleOutput.trim(),
        allowedLanguages,
        active,
      });

      return;
    }

    await onCreate({
      workspaceId,
      title: normalizedTitle,
      description:
        normalizedDescription,
      sampleInput:
        sampleInput.trim(),
      sampleOutput:
        sampleOutput.trim(),
      allowedLanguages,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-950/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
              <Code2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {isEditing
                  ? "Edit Coding Question"
                  : "Create Coding Question"}
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                {isEditing
                  ? "Update the selected coding problem."
                  : "Add a new coding problem to this classroom."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-400 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          {formError && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
              {formError}
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">
              Question title
            </span>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={200}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-400/40"
              placeholder="Example: Check Prime Number"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-zinc-400">
              Description
            </span>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={7}
              className="w-full resize-y rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-purple-400/40"
              placeholder="Explain the problem, input, and expected output."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-zinc-400">
                Sample input
              </span>

              <textarea
                value={sampleInput}
                onChange={(event) =>
                  setSampleInput(
                    event.target.value,
                  )
                }
                rows={5}
                className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-200 outline-none transition focus:border-indigo-400/40"
                placeholder="7"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-zinc-400">
                Sample output
              </span>

              <textarea
                value={sampleOutput}
                onChange={(event) =>
                  setSampleOutput(
                    event.target.value,
                  )
                }
                rows={5}
                className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-zinc-200 outline-none transition focus:border-emerald-400/40"
                placeholder="Prime"
              />
            </label>
          </div>

          <div>
            <span className="mb-3 block text-xs font-medium text-zinc-400">
              Allowed languages
            </span>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {languageOptions.map(
                (option) => {
                  const selected =
                    allowedLanguages.includes(
                      option.value,
                    );

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        toggleLanguage(
                          option.value,
                        )
                      }
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        selected
                          ? "border-purple-400/30 bg-purple-400/10 text-purple-200"
                          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
                      }`}
                    >
                      <span>
                        {option.label}
                      </span>

                      {selected && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {isEditing && (
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Question status
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Inactive questions are hidden from students.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActive(
                    (current) => !current,
                  )
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  active
                    ? "bg-emerald-500"
                    : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    active
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>
            </label>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}

              {saving
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Question"
                  : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}