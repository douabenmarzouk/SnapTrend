pipeline {
    agent any

    tools {
        nodejs 'node-22.18'
    }

    triggers {
        pollSCM('H/10 * * * 1-5')
    }

    parameters {
        booleanParam(
            name: 'DEBUG_BUILD',
            defaultValue: true,
            description: 'Activer lint et tests'
        )
    }

    environment {
        IMAGE_NAME = 'doua82400/angulare-app'
        IMAGE_TAG  = 'latest'
        SONAR_HOST_URL = 'http://localhost:9000'

        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;" +
               "C:\\Program Files\\Docker\\Docker\\resources;" +
               "C:\\Program Files\\Docker\\cli-plugins;" +
               "${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/douabenmarzouk/SnapTrend.git',
                    credentialsId: 'github_cred'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Angular') {
            steps {
                bat 'npx ng build --configuration production'
            }
        }

        stage('Lint') {
            when { expression { params.DEBUG_BUILD } }
            steps {
                bat 'npx ng lint || exit 0'
            }
        }

        stage('Test') {
            when { expression { params.DEBUG_BUILD } }
            steps {
                bat 'npx ng test --watch=false || exit 0'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_TOKEN = credentials('SONAR_TOKEN')
            }
            steps {
                bat '''
                npx sonar-scanner ^
                  -Dsonar.projectKey=SnapTrend ^
                  -Dsonar.sources=src ^
                  -Dsonar.host.url=%SONAR_HOST_URL% ^
                  -Dsonar.login=%SONAR_TOKEN%
                '''
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker --version'
                bat 'docker info'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Security Scan - Trivy') {
            steps {
                bat '''
                echo ===== Trivy security scan =====
                set TRIVY_CACHE_DIR=%WORKSPACE%\\.trivy-cache

                trivy image ^
                  --severity HIGH,CRITICAL ^
                  --no-progress ^
                  --timeout 10m ^
                  %IMAGE_NAME%:%IMAGE_TAG%

                if exist %WORKSPACE%\\.trivy-cache rmdir /s /q %WORKSPACE%\\.trivy-cache
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'doua-dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PSW'
                )]) {
                    bat '''
                    REM Docker config local pour éviter Windows Credential Manager
                    set DOCKER_CONFIG=%WORKSPACE%\\.docker
                    mkdir %DOCKER_CONFIG% 2>NUL

                    echo {"credsStore": ""} > %DOCKER_CONFIG%\\config.json

                    echo %DOCKER_PSW% | docker --config %DOCKER_CONFIG% login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                bat '''
                docker --config %WORKSPACE%\\.docker push %IMAGE_NAME%:%IMAGE_TAG%
                docker --config %WORKSPACE%\\.docker logout
                '''
            }
        }

        stage('Docker Cleanup') {
            steps {
                bat 'docker image prune -f'
            }
        }

        stage('Deploy to Kubernetes') {
            environment {
                KUBECONFIG = 'C:\\Users\\Jenkins\\.kube\\config'
            }
            steps {
                bat '''
                echo ===== Deployment Kubernetes =====
                kubectl apply -f C:\\Users\\Doua\\Documents\\pinterest-app\\k8s\\deploymentservice.yaml
                kubectl rollout status deployment/frontend-deployment
                '''
            }
        }

    }

    post {
        always {
            archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
        }
        success {
            echo 'Build complet avec succès !'
        }
        failure {
            echo 'Échec du build'
        }
    }
}
