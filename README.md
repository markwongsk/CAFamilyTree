The idea of this project is to display the lineage of CAs of CMU's
15-100/15-110/15-112 course.

For developers:

In order to get started run "npm install"
And then run "grunt" to compile the typescript files into javascript files

If you need to add/update libraries, you need to install bower. Run
"sudo npm install -g bower" to install bower. Add the package into bower.json
and run "bower install".

To launch, first run
``
python -m SimpleHttpServer 8000
``
(or really, any simple static web server), then navigate to http://localhost:8000/index.html
