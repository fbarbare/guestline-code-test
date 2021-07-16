export function getEnvironmentVariable(environmentVariableName: string): string {
  const environmentVariableValue = process.env[environmentVariableName];

  if (typeof environmentVariableValue !== 'string') {
    throw new Error(
      `The environment variable ${environmentVariableName} is invalid, got: ${environmentVariableValue}`
    );
  }

  return environmentVariableValue;
}
