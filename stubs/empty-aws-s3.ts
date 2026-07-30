// Stub for the optional @aws-sdk/client-s3 peer dependency of
// @strands-agents/sdk (used only by its Bedrock-oriented S3 context-offloader
// plugin, which this project never configures/uses). Kept so Turbopack can
// statically resolve the SDK's dynamic import without pulling in the AWS SDK.
export class S3Client {
  constructor() {
    throw new Error("@aws-sdk/client-s3 is not installed in this project");
  }
}
export class PutObjectCommand {
  constructor() {
    throw new Error("@aws-sdk/client-s3 is not installed in this project");
  }
}
export class GetObjectCommand {
  constructor() {
    throw new Error("@aws-sdk/client-s3 is not installed in this project");
  }
}
