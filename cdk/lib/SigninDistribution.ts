import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  PriceClass,
  SSLMethod,
  SecurityPolicyProtocol,
} from '@aws-cdk/aws-cloudfront';
import { Construct } from '@aws-cdk/core';
import { SigninBucke } from './SignInBucket';

export class SigninDistribution extends CloudFrontWebDistribution {
  constructor(
    scope: Construct,
    id: string,
    signinBucket: SigninBucke,
    identity: OriginAccessIdentity,
    fqdn: string,
    acmCertificateArn: string
  ) {
    super(scope, id, {
      errorConfigurations: [
        {
          errorCachingMinTtl: 300,
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCachingMinTtl: 300,
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: signinBucket,
            originAccessIdentity: identity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_200,
      viewerCertificate: {
        aliases: [fqdn],
        props: {
          acmCertificateArn: acmCertificateArn,
          minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2019,
          sslSupportMethod: SSLMethod.SNI,
        },
      },
    });
  }
}
