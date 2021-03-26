import { OriginAccessIdentity } from '@aws-cdk/aws-cloudfront';
import * as cdk from '@aws-cdk/core';
import { SigninBucke } from './SignInBucket';
import { SigninDistribution } from './SigninDistribution';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { HostedZone } from '@aws-cdk/aws-route53';
import { SigninARecord } from './SigninARecord';

dotenv.config();

const URA_KATA_SIGNIN_DOMAIN_NAME = process.env
  .URA_KATA_SIGNIN_DOMAIN_NAME as string;
const URA_KATA_SIGNIN_HOST_NAME = process.env
  .URA_KATA_SIGNIN_HOST_NAME as string;
const URA_KATA_CERTIFICATE_ARN = process.env.URA_KATA_CERTIFICATE_ARN as string;
const URA_KATA_PUBLIC_HOSTED_ZONE_ID = process.env
  .URA_KATA_PUBLIC_HOSTED_ZONE_ID as string;

export class SigninStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const identity = new OriginAccessIdentity(
      this,
      'SigninOriginAccessIdentity'
    );

    const bucket = new SigninBucke(this, 'SigninBucket', identity);

    const signinFqdn = `${URA_KATA_SIGNIN_HOST_NAME}.${URA_KATA_SIGNIN_DOMAIN_NAME}`;

    const distribution = new SigninDistribution(
      this,
      'SigninDistribution',
      bucket,
      identity,
      signinFqdn,
      URA_KATA_CERTIFICATE_ARN
    );

    const hostZone = HostedZone.fromHostedZoneAttributes(
      this,
      'UraKataPublicHostedZone',
      {
        hostedZoneId: URA_KATA_PUBLIC_HOSTED_ZONE_ID,
        zoneName: URA_KATA_SIGNIN_DOMAIN_NAME,
      }
    );

    new SigninARecord(
      this,
      'SigninARecord',
      distribution,
      hostZone,
      signinFqdn
    );

    new BucketDeployment(this, 'SigninBucketDeployment', {
      sources: [Source.asset(path.join(__dirname, '../../app/build'))],
      destinationBucket: bucket,
      distribution: distribution,
      distributionPaths: ['/*'],
    });
  }
}
