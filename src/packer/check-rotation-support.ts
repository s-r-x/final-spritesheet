import {
  PACKER_ROTATION_SUPPORTED_ALGORITHMS,
  PACKER_ROTATION_SUPPORTED_FRAMEWORKS,
  type tOutputFramework,
  type tPackerAlgorithm,
} from "#config";

export const checkPackerRotationSupport = ({
  framework,
  algorithm,
}: {
  framework: tOutputFramework;
  algorithm: tPackerAlgorithm;
}): boolean => {
  return (
    PACKER_ROTATION_SUPPORTED_FRAMEWORKS.has(framework) &&
    PACKER_ROTATION_SUPPORTED_ALGORITHMS.has(algorithm)
  );
};
