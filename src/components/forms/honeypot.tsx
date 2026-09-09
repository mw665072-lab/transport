import type { UseFormRegisterReturn } from "react-hook-form";

/**
 * Spam trap.
 *
 * `inert` rather than `aria-hidden`: it hides the field from assistive
 * technology *and* removes it from the focus order, so nothing can ever focus a
 * hidden element. Focusing an aria-hidden field is blocked by the browser, which
 * previously left a customer stuck on a form that would not submit.
 *
 * The value is never validated in the browser. If a password manager autofills
 * it, a real customer must still be able to submit; only the server decides
 * whether a submission looks automated.
 */
export function Honeypot({ id, register }: { id: string; register: UseFormRegisterReturn }) {
  return (
    <div inert className="absolute -left-[10000px] h-px w-px overflow-hidden">
      {/* The label and name avoid words a password manager recognises, so the
          field is never autofilled for a real customer. */}
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        {...register}
      />
    </div>
  );
}
