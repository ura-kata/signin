#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SigninStack } from '../lib/SigninStack';

const app = new cdk.App();
new SigninStack(app, 'SigninStack', {
  stackName: 'ura-kata-signin-stack',
  env: {
    region: 'ap-northeast-1',
  },
});
