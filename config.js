module.exports = {
  PORT: process.env.PORT || 5000,
  
  // Configuration Firebase
  FIREBASE_PROJECT_ID: 'knachsoft',
  FIREBASE_DATABASE_URL: 'https://knachsoft-default-rtdb.firebaseio.com',
  
  // Service Account pour développement local (utilisé si FIREBASE_CREDENTIALS env var n'existe pas)
  FIREBASE_SERVICE_ACCOUNT: {
    "type": "service_account",
    "project_id": "knachsoft",
    "private_key_id": "a76e9749b415607195867212459968ca4d96ae94",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC131fRtVLcDhYV\nOTdCXCoQeTAJL3lKtTwu5zYFDGEQbbHJNrPT3kzIPgtHGCNbzqclhkJsIZyeAdEf\np/X10BwrYrNNEQYi7jIRMZBrEX90hPnlFu27153Cw09mBAWhXyCXo7ppFB1wle9W\nwFpt1eBtfluaRhgBUCi0MsjEb763npCe78gWysWRZ49Gwhgyv2MjpAMGASafhWli\nJNnGRktm1td7b7IjTp2gzIY/eGSjZCk+KECAzsCgjV0qodoMzemv6NV04SV/bek+\nsqO0W2na2rB5iqN4TKpW03ToWm4bU36dT2HnsTiQoXtRsCJxJGYXZ4uKoyPs3UF3\ntrYErgddAgMBAAECggEACbrSLdXTl2ez2TyndD1OLSBFSFyEkpFZuqWjxMc0gyaR\n2hKl3LS6FVqyYOzi6V9dHvtiNCWOhX/R4lhqkWpp3g1TS9EYa7J5YGTvKwyI2HY2\nZeyL2TPat10aXeS4W2QlhXnyIqXQ7GFtEuOgAtvBZwIuoDUrRW4L0MDIb6/jELDL\nvV18Aj03tUZrwmBYehiuIF5LARmudh4PT1/WZLxjaXdu3GTFA15YwldxOri4Siap\nSYmnRvPGZIdi6EBpBUWuKz+eYWG1D4kocNWAuE9e6bQ5ipBrMP1A8SaxhOekKcpO\nQppu/uhqKjyn5LJqWQtOzjV7ZnnnqihlDafo0mpMKQKBgQDl8t5CwB1IP+Wue83s\n7XzzrAyjzYcBfmpdJtR4KBSziaVtlAQNYt7yfSDX/uquh0EFZ69hzlGQd0GTBo4Q\navmWPJGB+m99M2VAAckR3MDGoD/FymB4PNiV6PsemuHAmIwriD9qpTlp9ea1FtXV\nF9QHRYQ4G72ocraUFcDHXTiJxQKBgQDKeiItfXs3P3mjD3i6X7XSI3oKf934udju\nWUB+MsXUQkInLInvCQxy4pMJ59fHdeuH2uf3C+GNxRkJOQQJ9UKBWKUb7OC+Q12P\n5Vok6PT8Eltyrf/X87zPBz3fIie3ZCmxDFv8imCCd9dO12BbLRqFGnT/Nlwazjfx\nOqHTWMgYuQKBgBKaYWzZCgVsVfKVxYUjeXZlNuiRmhh+17ANkibeZz5XJnEFBobm\nts67XMrcrrPL8XC0gLXS8TpUy5NPdnLRlLuYztTLI/XnEIvrGQ8+4sGu+TnRM5jG\no2cNYDOLqDPio4RqE2dXUpvF7xI7dLU2pkqoTxgS9ncIQMkeMWhvnEFZAoGAY+Cr\nS1VCmpYtIkpXe1gLEIV/hf5dOHw0jh5oudfBzlqA12IZCFimU2WAsroyrql0baeG\nFU8/C/fVyb7eRys8iyF3ELdghXolhP3V4a8oac+EXKWINrZ8xIMF+jOW89fs2PEH\nzyNTSAhlpPaJCXDOTCoo3FusQ2zGG7CYcvCwg8ECgYEAsP5R8cY5zzoY6LA06mAD\nxiDtJmZUPB7sCPldiyU0sJMkVpgfwIewfLxcAZsBZlB0UnqVALl+mlY/GRZWQh8v\nNaaEYv9Fly9kN67ukFvbxlDg262SEL5MogVlan7tcjMx1EcUZ6KOaymEuF2ZW7o+\nYejsHZzr898UYS8RnqFb11U=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@knachsoft.iam.gserviceaccount.com",
    "client_id": "111628925863693284063",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40knachsoft.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  },
  
  ADMIN_PANEL_URL: 'https://knachsoft-admin.web.app'
};

