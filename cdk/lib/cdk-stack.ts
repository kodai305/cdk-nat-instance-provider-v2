import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  NatInstanceProviderV2,
  NatTrafficDirection,
  Peer,
  Port,
  Vpc,
} from "aws-cdk-lib/aws-ec2";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const provider = NatInstanceProviderV2.instanceV2({
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
      defaultAllowedTraffic: NatTrafficDirection.OUTBOUND_ONLY,
    });

    const vpc = new Vpc(this, "NatInstanceProviderV2VPC", {
      natGateways: 1,
      natGatewayProvider: provider,
    });

    provider.securityGroup.addIngressRule(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(443)
    );
  }
}
