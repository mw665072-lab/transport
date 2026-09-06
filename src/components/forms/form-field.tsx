import { Label } from "@/components/ui/label";
export function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) { const id=`${htmlFor}-error`; return <div><Label htmlFor={htmlFor}>{label}</Label>{children}{error&&<p id={id} role="alert" className="mt-1.5 text-sm font-medium text-danger">{error}</p>}</div> }
export const describedBy=(name:string,error?:unknown)=>error?`${name}-error`:undefined;
