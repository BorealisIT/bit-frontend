#!/bin/bash

# more bash-friendly output for jq
JQ="jq --raw-output --exit-status"

configure_aws_cli(){
	aws --version
	aws configure set default.region us-east-1
	aws configure set default.output json
}

post_to_slack () {
  # format message as a code block ```${msg}```
  SLACK_MESSAGE="$1"
  SLACK_URL=
 
  case "$2" in
    INFO)
      SLACK_ICON=':slack:'
      ;;
    WARNING)
      SLACK_ICON=':warning:'
      ;;
    ERROR)
      SLACK_ICON=':bangbang:'
      ;;
    *)
      SLACK_ICON=':slack:'
      ;;
  esac
 
  #curl -X POST --data "payload={\"text\": \"${SLACK_ICON} ${SLACK_MESSAGE}\"}" ${SLACK_URL}
}

deploy_cluster() {

    family="BorealisIT"

    make_task_def
    register_definition
    if [ $(aws ecs update-service --cluster BOREALIS-PROD --service BOREALIS-PROD --task-definition $revision | \
                   $JQ '.service.taskDefinition') != $revision ]; then
        echo "Error updating service."
        return 1
    fi

    # wait for older revisions to disappear
    # not really necessary, but nice for demos
    END=300
    for attempt in $(seq 1 $END);
     do
        echo "Check number $attempt"
        if stale=$(aws ecs describe-services --cluster BOREALIS-PROD --services BOREALIS-PROD | \
                       $JQ ".services[0].deployments | .[] | select(.taskDefinition != \"$revision\") | .taskDefinition"); then
            echo "Waiting for stale deployments:"
            echo "$stale"
            sleep 10
        else
            echo "Deployed!"
            post_to_slack "New Frontend deployed!" "INFO"
            return 0
        fi
    done
    echo "Service update took too long."
    post_to_slack "Frontend deployment failed!" "ERROR"
    return 1
}

make_task_def(){
  task_template='[
    {
      "memory": 128,
      "portMappings": [
        {
          "hostPort": 80,
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "name": "nginx",
      "links": [
        "bit-frontend:FRONTEND"
      ],
      "image": "borealisit/nginx",
      "cpu": 1
    },
    {
      "memory": 512,
      "portMappings": [
        {
          "hostPort": 5000,
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "name": "bit-frontend",
      "image": "borealisit/bit-frontend",
      "cpu": 1
    }
  ]'
  
  task_def=$(printf "$task_template")
}


register_definition() {

    if revision=$(aws ecs register-task-definition --container-definitions "$task_def" --family $family | $JQ '.taskDefinition.taskDefinitionArn'); then
        echo "Revision: $revision"
    else
        echo "Failed to register task definition"
        return 1
    fi

}

configure_aws_cli
deploy_cluster