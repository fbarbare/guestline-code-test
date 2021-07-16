import * as t from 'io-ts';

function getErrorPath(error: t.ValidationError): string {
  return error.context
    .filter(({ key }, index) => {
      if (!key) return false;

      // Skip the index of the intersection failure
      if (index && (error.context[index - 1].type as any)._tag === 'IntersectionType') {
        return false;
      }
      // Skip the index of the union failure
      if (index && (error.context[index - 1].type as any)._tag === 'UnionType') {
        return false;
      }

      return true;
    })
    .map(({ key }) => key)
    .join('.');
}
function getErrorType(error: t.ValidationError): string {
  return [...error.context].pop()!.type.name;
}
function getErrorValue(v: unknown): string {
  if (typeof v === 'function') {
    return t.getFunctionName(v);
  }
  if (typeof v === 'number' && !isFinite(v)) {
    if (isNaN(v)) {
      return 'NaN';
    }
    return v > 0 ? 'Infinity' : '-Infinity';
  }
  return JSON.stringify(v);
}

function getErrorDetails(error: t.ValidationError) {
  const path = getErrorPath(error);
  const type = getErrorType(error);
  const value = getErrorValue(error.value);

  return { path, type, value };
}

export function getErrorsDetails(
  errors: t.Errors
): Array<{ path: string; type: string; value: string }> {
  let errorsDetails = errors.map((error) => getErrorDetails(error));

  // Eliminates duplicates due to unions
  const errorsDetailsWithFilteredUnions: Array<{ path: string; type: string; value: string }> = [];
  errorsDetails.forEach((currentError, index) => {
    if (index === 0) {
      return errorsDetailsWithFilteredUnions.push(currentError);
    }

    const previousError =
      errorsDetailsWithFilteredUnions[errorsDetailsWithFilteredUnions.length - 1];
    if (currentError.path === previousError.path) {
      previousError.type += ` | ${currentError.type}`;

      return;
    }

    return errorsDetailsWithFilteredUnions.push(currentError);
  });

  return errorsDetailsWithFilteredUnions;
}

export function getErrorMessages(errors: t.Errors): ReadonlyArray<string> {
  const errorsDetails = getErrorsDetails(errors);

  return errorsDetails.map(({ path, type, value }) => {
    let message = 'Invalid value supplied';

    if (path) message += ` to ${path}: `;
    else message += ': ';

    message += `${value}. Expected: ${type}`;

    return message;
  });
}
