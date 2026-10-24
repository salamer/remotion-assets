import Ajv from "ajv";
import catalog from "../../schemas/legacy-catalog.json";

const ajv = new Ajv({ strict: false, allErrors: true });
const validators = new Map(
  catalog.map((entry) => [entry.id, ajv.compile(entry.propsSchema)]),
);
export function validateLegacy(
  id: string,
  props: Record<string, unknown>,
): string[] {
  const validate = validators.get(id);
  if (!validate) return [`Unknown legacy component: ${id}`];
  if (validate(props)) return [];
  return (validate.errors || []).map(
    (e) => `${e.instancePath || "/"} ${e.message}`,
  );
}
