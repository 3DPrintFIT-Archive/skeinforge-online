skeinforge-online
=================

Online skeinforge running on OpenShift. Very dirty PHP code, we were just wondering, if it works.

Pushing
=======

You can push simulatously to GitHub and OpenShift. Copy the gitconfig file to your git config:

    cp gitconfig .git/config

To push only to GitHub:

    git push

To push only to OpenShift:

    git push openshift

To push to both of them:

    git push all

Pushing to OpenShift kills all processes, check noone is using the service!
