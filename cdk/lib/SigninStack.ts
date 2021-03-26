import { OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { SigninBucke } from './SignInBucket';
import { SigninDistribution } from './SigninDistribution';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as path from 'path';

export class SigninStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const identity = new OriginAccessIdentity(
      this,
      'SigninOriginAccessIdentity'
    );

    const bucket = new SigninBucke(this, 'SigninBucket', identity);

    const distribution = new SigninDistribution(
      this,
      'SigninDistribution',
      bucket,
      identity
    );

    new BucketDeployment(this, 'SigninBucketDeployment', {
      sources: [Source.asset(path.join(__dirname, '../../app/build'))],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });
  }
}
