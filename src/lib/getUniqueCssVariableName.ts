let uniqueCssVariableName = 0;
export function uniqueVarName() {
  return "--ta" + uniqueCssVariableName++;
}

export function resetUniqueVarName() {
  uniqueCssVariableName = 0;
}
