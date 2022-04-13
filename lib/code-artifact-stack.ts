import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as codeartifact from "aws-cdk-lib/aws-codeartifact";

export class CodeArtifactStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    let labDomain = new codeartifact.CfnDomain(this, "LabDomain", {
      domainName: "cdkadvancedlab",
    });

    let npmRepository = new codeartifact.CfnRepository(this, "LabNpmArtifact", {
      domainName: labDomain.domainName,
      repositoryName: "npmjs",
      externalConnections: ["public:npmjs"],
    });
    npmRepository.addDependsOn(labDomain);

    let pypiRepository = new codeartifact.CfnRepository(this, "LabPypiArtifact", {
      domainName: labDomain.domainName,
      repositoryName: "pypi",
      externalConnections: ["public:pypi"],
    });
    pypiRepository.addDependsOn(labDomain);

    let labRepository = new codeartifact.CfnRepository(this, "LabRepository", {
      domainName: labDomain.domainName,
      repositoryName: "cdkadvancedlab",
      upstreams: [npmRepository.repositoryName, pypiRepository.repositoryName],
    });
    labRepository.addDependsOn(labDomain);
    labRepository.addDependsOn(npmRepository);
    labRepository.addDependsOn(pypiRepository);
  }
}
