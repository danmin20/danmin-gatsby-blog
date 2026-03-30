---
emoji: 🍺
title: 'Terraform, 테라 폼 미쳤다'
date: '2026-03-30'
categories: Dev
---

> 다들 테라 좋아하시나요? 저는 일본 맥주 차원이 달라 병 말기랍니다..

&nbsp;

서버 하나 띄우려고 AWS 콘솔에 접속해서 이것저것 클릭한 경험, 다들 있을 것이다.  
처음에는 뭐 괜찮다. 하지만 점점 리소스가 늘어나고, 팀원이 늘어나면 이야기가 달라진다.

"이 S3 버킷 누가 만든 거야?"  
"CloudFront 설정 왜 바뀌었지?"  
"스테이징이랑 프로덕션 설정이 왜 다르지?"

![](0.webp)

> 그렇게 시작되는 추노 대작전..

수동으로 인프라를 관리하면 히스토리 추적이 안 되고, 재현이 안 되고, 리뷰가 안 된다.  
코드는 Git으로 관리하면서, 정작 코드가 올라갈 인프라는 콘솔에서 클릭으로 관리하고 있다니.  
뭔가 아이러니하지 않은가?

&nbsp;

## Infrastructure as Code (IaC)

이런 문제를 해결하기 위해 등장한 개념이 바로 **IaC(Infrastructure as Code)** 다.  
말 그대로, 인프라를 코드로 정의하고 관리하는 것이다.

IaC를 사용하면 다음과 같은 이점이 있다.

- **버전 관리**: 인프라 변경 사항을 Git으로 추적할 수 있다
- **재현성**: 동일한 코드로 동일한 환경을 몇 번이고 만들 수 있다
- **코드 리뷰**: 인프라 변경도 PR 리뷰를 통해 검증할 수 있다
- **자동화**: CI/CD 파이프라인에 태워서 자동으로 배포할 수 있다

예전에는 설정 하나 바뀌면 다시 맞추는 게 일이었는데,  
이제는 코드만 있으면 같은 환경을 그대로 복제할 수 있다.  
또 인프라 변경 사항이 Git 로그로 다 남으니, 누가 뭘 바꿨는지 몰라서 당황할 일도 없어졌다.

&nbsp;

## Terraform이란?

**Terraform**은 HashiCorp에서 만든 오픈소스 IaC 도구다.  
**HCL(HashiCorp Configuration Language)** 이라는 선언형 언어로 인프라를 정의한다.

"선언형"이라는 게 핵심인데,
"어떻게 만들어라"가 아니라 **"이런 상태여야 한다"** 라고 기술하는 것이다.

```hcl
# "S3 버킷이 하나 있어야 한다"고 선언
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-awesome-bucket"
}
```

Terraform이 알아서 현재 상태와 원하는 상태를 비교하고,  
차이가 있으면 그 차이만큼만 변경해준다. (이걸 **Plan & Apply** 라고 부른다)

&nbsp;

### 다른 IaC 도구와 비교

|               | Terraform  | CloudFormation | Pulumi                  |
| ------------- | ---------- | -------------- | ----------------------- |
| 제공사        | HashiCorp  | AWS            | Pulumi                  |
| 언어          | HCL        | JSON/YAML      | TypeScript, Python 등   |
| 멀티 클라우드 | O          | X (AWS 전용)   | O                       |
| 상태 관리     | State 파일 | AWS 내부 관리  | Pulumi Cloud            |
| 학습 곡선     | 보통       | 높음           | 낮음 (익숙한 언어 사용) |

Terraform의 가장 큰 장점은 **멀티 클라우드 지원**이다.  
AWS, GCP, Azure는 물론이고 Cloudflare, Vercel, GitHub까지 Provider로 지원한다.  
즉, 한 가지 문법으로 여러 클라우드의 리소스를 관리할 수 있다는 뜻이다.

&nbsp;

## 핵심 개념 정리

Terraform을 사용하기 전에 알아야 할 핵심 개념들을 정리해보자.

&nbsp;

### Provider

Provider는 Terraform이 어떤 클라우드/서비스와 통신할지 정의하는 플러그인이다.

```hcl
# AWS Provider 설정
provider "aws" {
  region = "ap-northeast-2"  # 서울 리전
}
```

AWS를 쓴다면 `aws`, GCP라면 `google`, GitHub라면 `github` Provider를 사용하면 된다.

&nbsp;

### Resource

Resource는 실제로 생성할 인프라 리소스를 정의하는 블록이다.

```hcl
resource "aws_s3_bucket" "frontend_assets" {
  bucket = "my-frontend-assets"

  tags = {
    Environment = "production"
    Team        = "frontend"
  }
}
```

`resource "리소스_타입" "이름"` 형태로 선언한다.  
여기서 `"이름"`은 Terraform 내부에서 이 리소스를 참조할 때 쓰는 식별자다.

&nbsp;

### State

State는 Terraform이 관리하는 인프라의 **현재 상태를 기록한 파일**이다.  
기본적으로 `terraform.tfstate`라는 JSON 파일에 저장된다.

Terraform은 이 State 파일을 기반으로 "지금 상태"와 "코드에 선언된 상태"를 비교해서  
무엇을 추가/변경/삭제해야 하는지 판단한다.

> ‼️ State 파일에는 민감한 정보(비밀번호, 키 등)가 포함될 수 있으므로  
> Git에 커밋하면 안 된다! (이건 뒤에서 다룰 Remote Backend로 해결한다.)

&nbsp;

### Variable & Output

변수와 출력값을 정의해서 코드의 재사용성을 높일 수 있다.

```hcl
# variables.tf
variable "environment" {
  description = "배포 환경"
  type        = string
  default     = "dev"
}

variable "bucket_name" {
  description = "S3 버킷 이름"
  type        = string
}

# main.tf
resource "aws_s3_bucket" "assets" {
  bucket = "${var.bucket_name}-${var.environment}"

  tags = {
    Environment = var.environment
  }
}

# outputs.tf
output "bucket_arn" {
  description = "생성된 S3 버킷의 ARN"
  value       = aws_s3_bucket.assets.arn
}
```

&nbsp;

### Module

Module은 여러 리소스를 하나의 패키지로 묶은 것이다.  
함수처럼 재사용할 수 있어서, 같은 패턴의 인프라를 여러 환경에 쉽게 적용할 수 있다.

```hcl
# modules/s3-static-site/main.tf
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
}

resource "aws_cloudfront_distribution" "this" {
  origin {
    domain_name = aws_s3_bucket.this.bucket_regional_domain_name
    origin_id   = "S3-${var.bucket_name}"
  }
  # ... CloudFront 설정
}

# 사용하는 쪽
module "production_site" {
  source      = "./modules/s3-static-site"
  bucket_name = "my-prod-site"
}

module "staging_site" {
  source      = "./modules/s3-static-site"
  bucket_name = "my-staging-site"
}
```

이런 식으로 Module을 만들어 놓으면,
프로덕션/스테이징/개발 환경을 동일한 구조로 빠르게 찍어낼 수 있다.

&nbsp;

## AWS 실습 예제

이론만으로는 감이 안 잡히니,  
실제로 AWS에서 프론트엔드 정적 사이트를 배포하는 인프라를 Terraform으로 구성해보자.

&nbsp;

### 프로젝트 구조

```
infra/
├── main.tf          # 메인 리소스 정의
├── variables.tf     # 변수 정의
├── outputs.tf       # 출력값 정의
├── provider.tf      # Provider 설정
└── terraform.tfvars # 변수 값 (Git ignore)
```

&nbsp;

### Provider 설정

```hcl
# provider.tf
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

&nbsp;

### S3 + CloudFront 구성

```hcl
# main.tf

# 정적 파일을 저장할 S3 버킷
resource "aws_s3_bucket" "frontend" {
  bucket = var.bucket_name
}

# 버킷 퍼블릭 액세스 차단 (CloudFront 통해서만 접근)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront에서 S3에 접근할 수 있도록 OAC 설정
resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${var.bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront 배포
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "S3-${var.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # SPA 라우팅을 위한 커스텀 에러 응답
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

&nbsp;

### 변수와 출력값

```hcl
# variables.tf
variable "aws_region" {
  description = "AWS 리전"
  type        = string
  default     = "ap-northeast-2"
}

variable "bucket_name" {
  description = "S3 버킷 이름"
  type        = string
}

# outputs.tf
output "cloudfront_domain" {
  description = "CloudFront 배포 도메인"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "s3_bucket_name" {
  description = "S3 버킷 이름"
  value       = aws_s3_bucket.frontend.id
}
```

&nbsp;

### 실행해보기

```bash
# 초기화 (Provider 플러그인 다운로드)
terraform init

# 변경 사항 미리 확인
terraform plan -var="bucket_name=my-frontend-site"

# 실제 적용
terraform apply -var="bucket_name=my-frontend-site"

# 삭제하고 싶을 때
terraform destroy
```

`terraform plan`을 실행하면 어떤 리소스가 생성/변경/삭제될지 미리 보여준다.  
이게 정말 강력한 기능인데, 실수로 프로덕션 리소스를 날려먹는 참사를 방지할 수 있다.

&nbsp;

## CI/CD 연동

Terraform을 로컬에서만 실행하면 IaC의 장점을 반밖에 못 누리는 것이다.  
GitHub Actions와 연동해서 PR 기반으로 인프라를 관리해보자.

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  pull_request:
    paths:
      - 'infra/**'
  push:
    branches:
      - main
    paths:
      - 'infra/**'

env:
  AWS_REGION: ap-northeast-2
  TF_WORKING_DIR: infra

jobs:
  plan:
    name: Terraform Plan
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.7.0

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Terraform Init
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform init

      - name: Terraform Plan
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform plan -no-color
        id: plan

      - name: PR에 Plan 결과 코멘트
        uses: actions/github-script@v7
        with:
          script: |
            const output = `#### Terraform Plan 📋
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\`
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            });

  apply:
    name: Terraform Apply
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.7.0

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Terraform Init
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform init

      - name: Terraform Apply
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform apply -auto-approve
```

이 워크플로우의 핵심은 이렇다.

1. **PR을 올리면** `terraform plan`이 실행되고, 변경 사항이 코멘트로 달린다
2. **팀원이 리뷰하고 Merge하면** `terraform apply`가 자동으로 실행된다

이로써 인프라 변경도 코드 리뷰를 거치게 되는 것이다.  
누구의 잘못인지를 찾는 추노극도 더 이상 발생하지 않을 것이다.

![](2.jpg)

&nbsp;

## 팀 협업

혼자 쓸 때는 로컬에 State 파일을 두면 되지만, 팀으로 작업할 때는 **State를 공유**해야 한다.  
안 그러면 각자 다른 State를 보고 작업하게 되어 충돌이 발생한다.

&nbsp;

### Remote Backend (S3 + DynamoDB)

State 파일을 S3에 저장하고, DynamoDB로 동시 접근을 방지하는 게 가장 일반적인 패턴이다.

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-team-terraform-state"
    key            = "frontend/terraform.tfstate"
    region         = "ap-northeast-2"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}
```

S3 버킷에 State 파일을 저장하고,  
DynamoDB로 동시에 두 사람이 `terraform apply`를 실행하지 못하도록 잠금 처리하고,  
encrypt 설정으로 State 파일을 암호화하자.

이렇게 설정하면 팀원 모두가 같은 State를 바라보면서 작업할 수 있다.

&nbsp;

### Workspace

같은 코드로 여러 환경을 관리하고 싶을 때 Workspace를 사용한다.

```bash
# Workspace 생성
terraform workspace new staging
terraform workspace new production

# Workspace 전환
terraform workspace select staging

# 현재 Workspace 확인
terraform workspace show
```

코드에서는 `terraform.workspace`로 현재 Workspace를 참조할 수 있다.

```hcl
resource "aws_s3_bucket" "frontend" {
  bucket = "my-site-${terraform.workspace}"
  # staging이면 "my-site-staging"
  # production이면 "my-site-production"
}
```

이렇게 하면 하나의 코드베이스로 환경별 인프라를 깔끔하게 관리할 수 있다.

&nbsp;

## 마무리

"나는 프론트엔드 개발자인데 인프라까지 알아야 해?"라고 생각할 수도 있다.  
하지만 요즘은 프론트엔드 배포 파이프라인을 직접 구성하는 경우가 많다.

S3에 빌드 결과물 올리고, CloudFront로 CDN 설정하고, Route53으로 도메인 연결하고...

![](1.jpg)

이걸 매번 콘솔에서 클릭하는 것보다는 당연히 코드로 관리하는 게 훨씬 효율적이다.

- 새 프로젝트 인프라를 5분 만에 셋업할 수 있고,
- 스테이징과 프로덕션 환경을 완전히 동일하게 유지할 수 있으며,
- 인프라 변경 히스토리를 Git 로그로 추적할 수 있고,
- 문제가 생기면 이전 상태로 롤백할 수 있다.

정말 안 쓸 이유가 없는 Terraform.  
처음에는 HCL 문법이 낯설 수 있지만, 한번 익숙해지면 "이걸 왜 이제야 썼지?"라는 생각이 들 것이다.

공식 문서([Terraform Registry](https://registry.terraform.io/))에서 다양한 Provider와 Module을 찾아볼 수 있으니,  
관심이 있다면 한번 살펴보길 추천한다.

```toc

```
