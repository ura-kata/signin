import { OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';

export class SigninBucke extends Bucket {
  constructor(scope: Construct, id: string, identity: OriginAccessIdentity) {
    super(scope, id, {
      bucketName: 'ura-kata-signin-bucket',
    });

    const policy = new PolicyStatement({
      actions: ['s3:GetObject'],
      effect: Effect.ALLOW,
      principals: [identity.grantPrincipal],
      resources: [`${this.bucketArn}/*`],
    });

    this.addToResourcePolicy(policy);
  }
}
