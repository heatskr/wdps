
class ModelDocument
{
  constructor (dataValues = {}) {
    this._links       = dataValues._links || null;
    this.code         = dataValues.code || '';
    this.requester    = dataValues.requester || '';
    this.summary      = dataValues.summary || '';
    this.filename     = dataValues.filename || '';
    this.createdAt    = dataValues.createdAt || '';
    this.updatedAt    = dataValues.updatedAt || '';
    this.data         = dataValues.data || '';
    this.size         = dataValues.size || 0;
    this.mimetype     = dataValues.mimetype || '';
    this.uploadDir    = dataValues.uploadDir || '';
    this.documentType = dataValues.documentType || '';
    this.userId       = dataValues.userId || '';
  }
};

angular.module('todoApp', [])
.service ('docsAPI', function ($http) {
  this.getDocs = function (href) {
    return $http.get (href || '/api/document?page=0&size=10&sort=id,asc', {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.token
      }
    });
  };
})
.controller('DocListController', function ($scope, docsAPI) {
  var $c = this;

  $c.user = {
    username: 'bob',
    password: 'test123'
  };

  $c.token = sessionStorage.token || '';

  $c.refresh = function (href) {
    docsAPI.getDocs (href).then (function (res) {
      $c.documents = [];
      $c.page = res.data.page;
      $c.links = res.data._links;
      for (let doc of res.data._embedded.document) {
        $c.documents.push (new ModelDocument (doc));
      }
      $c.newDoc = new ModelDocument();
    });
  };

  if ($c.token) {
    $c.refresh ();
  }

  $c.login = function () {
    fetch ('/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ($c.user),
    }).then (function (res) {
      if (res.ok) {
        res.json ().then (function (res) {
          sessionStorage.token = res.token;
          $c.token = sessionStorage.token;
          $c.refresh ();
        });
      }
    });
  };

  $c.upload = function (ele) {
    if (!$c.newDoc._links) {
      return;
    }
    let file = ele.files[0];
    if (!file) {
      return;
    }


    let doc = $c.newDoc;
    let url = doc._links.self.href;

    let reader = new FileReader ();


    reader.addEventListener ('load', function () {
      doc.data = reader.result;
      doc.size = file.size;
      doc.mimetype = file.type;
      doc.filename = file.name;
      console.log (doc);
    });
    reader.readAsDataURL (file);
  };

  $c.download = function () {
    let doc = $c.newDoc;
    if (!doc.data) {
      return;
    }
    let arr = doc.data.split (',');
    let mime = arr[0].match (/:(.*?);/)[1];
    let bstr = atob (arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array (n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt (n);
    }

    let blob = new Blob ([u8arr], { type: mime });

    console.log(blob);

    let e = document.createEvent('MouseEvents');
    let a = document.createElement ('a');

    a.download = doc.filename;
    a.href = window.URL.createObjectURL (blob);
    a.dataset.downloadurl = [mime, a.download, a.href].join (':');
    e.initMouseEvent ('click', true, false, window, 0, 0, 0, 0, 0,
      false, false, false, false, 0, null);
    a.dispatchEvent (e);
  };

  $c.go = function (href) {
    $c.refresh (href);
  };

  $c.sort = function (column) {
    let url = new URL ($c.links.self.href);
    for (let [key, value] of url.searchParams) {
      if (key == 'sort') {
        let [field, dir] = value.split (',');

        console.log(field, dir);

        if (field == column) {
          dir = (dir == 'desc') ? 'asc' : 'desc';
        } else {
          dir = 'asc';
        }

        url.searchParams.set ('sort', column + ',' + dir);
        break;
      }
    }
    $c.refresh (url.href);
  };

  $c.save = function() {
    if ($c.newDoc._links == null) {
      fetch ('/api/document', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.token,
        },
        body: JSON.stringify($c.newDoc)
      }).then (function (res) {
        if (res.ok) {
          $c.refresh ($c.links.self.href);
        }
      });
    } else {
      fetch ($c.newDoc._links.self.href, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.token,
        },
        body: JSON.stringify ($c.newDoc),
      }).then (function (res) {
        if (res.ok) {
          $c.refresh ($c.links.self.href);
        }
      });
    }
  };

  $c.edit = async function (doc) {
    $c.newDoc = doc;
  };

  $c.delete = function (curDoc) {
    if (!confirm ('Are you sure?')) {
      return;
    }
    fetch ($c.newDoc._links.self.href, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.token,
      },
    }).then (function (res) {
      if (res.ok) {
        $c.refresh ($c.links.self.href);
      }
    });
  };
})
;
