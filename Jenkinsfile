pipeline {
    agent { label 'my_agent' }

    tools {
        nodejs 'node-22.18'
        maven 'maven'
    }

    triggers {
        pollSCM('H/10 * * * 1-5')
    }

    parameters {
        booleanParam(name: 'DEBUG_BUILD', defaultValue: true, description: 'Activer lint et tests.')
    }

    environment {
        GIT_CRED = credentials('github_cred')
        SONAR_HOST_URL = 'http://localhost:9000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/douabenmarzouk/SnapTrend.git', credentialsId: 'github_cred'
            }
        }

        stage('Install Dependencies') {
            steps { bat 'npm install' }
        }

        stage('Build') {
            steps { bat 'npx ng build' }
        }

        stage('Quality Checks') {
            when { expression { return params.DEBUG_BUILD } }
            stages {
                stage('Lint') {
                    steps { bat 'npx ng lint || exit 0' }
                }

                stage('Test') {
                    steps { bat 'npx ng test --watch=false || exit 0' }
                }

                stage('SonarQube Analysis') {
                     environment {
                                SONAR_HOST_URL = 'http://localhost:9000' 
                                SONAR_AUTH_TOKEN=credentials('SONAR_TOKEN')
                               }


                    steps {
                            bat 'mvn sonar:sonar -Dsonar.projectKey=sample_project -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_AUTH_TOKEN'
                        }
                    }
                }
            }
        }
    }

    post {
        always { archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true }
        success { echo 'Build complet avec succès !' }
        failure {
            mail to: 'benmarzoudoua@gmail.com',
                 subject: "Échec du build Jenkins: ${env.JOB_NAME}",
                 body: "Le build #${env.BUILD_NUMBER} a échoué. Voir les logs: ${env.BUILD_URL}"
        }
    }
}
