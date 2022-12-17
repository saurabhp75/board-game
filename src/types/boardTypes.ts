export interface boardState {
  board: number[];
  searchNum: number;
  state: "init" | "reset" | "won" | "changeDuration";
  won: boolean;
  duration: number; // 1000ms
}

export interface boardAction {
  type: "reset" | "correctClick" | "incorrectClick" | "won" | "changeDuration";
  payload?: number;
}

export interface cellState {
  state: "hide" | "found" | "cross";
}

export interface cellAction {
  type: "hide" | "found" | "cross" | "changeDuration";
}

export type gameData = Record<number, string>;

export interface tokenResponse {
  access_token: string;
  expires_in: number;
  prompt: string;
  token_type: string;
  scope: string;
  state: string;
  error: number;
  error_description: string;
  error_uri: string;
}

export interface tokenError {
  type: string;
}

export interface OverridableTokenClientConfig {
  scope?: string;
  include_granted_scopes?: boolean;
  prompt?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  state?: string;
}

export interface TokenClient {
  requestAccessToken(overrideConfig?: OverridableTokenClientConfig): void;
}

export interface FILE {
  "kind": "drive#file";
  "id": string;
  "name": string;
  "mimeType": string;
  "description": string;
  "starred": boolean;
  "trashed": boolean;
  "explicitlyTrashed": boolean;
  "trashingUser": {
    "kind": "drive#user";
    "displayName": string;
    "photoLink": string;
    "me": boolean;
    "permissionId": string;
    "emailAddress": string
  };
  "trashedTime": Date;
  "parents": [
    string
  ];
  "properties": {
    (key: string): string
  };
  "appProperties": {
    (key: string): string
  };
  "spaces": [
    string
  ];
  "version": bigint;
  "webContentLink": string;
  "webViewLink": string;
  "iconLink": string;
  "hasThumbnail": boolean;
  "thumbnailLink": string;
  "thumbnailVersion": bigint;
  "viewedByMe": boolean;
  "viewedByMeTime": Date;
  "createdTime": Date;
  "modifiedTime": Date;
  "modifiedByMeTime": Date;
  "modifiedByMe": boolean;
  "sharedWithMeTime": Date;
  "sharingUser": {
    "kind": "drive#user";
    "displayName": string;
    "photoLink": string;
    "me": boolean;
    "permissionId": string;
    "emailAddress": string
  };
  "owners": [
    {
      "kind": "drive#user";
      "displayName": string;
      "photoLink": string;
      "me": boolean;
      "permissionId": string;
      "emailAddress": string
    }
  ];
  "teamDriveId": string;
  "driveId": string;
  "lastModifyingUser": {
    "kind": "drive#user";
    "displayName": string;
    "photoLink": string;
    "me": boolean;
    "permissionId": string;
    "emailAddress": string
  };
  "shared": boolean;
  "ownedByMe": boolean;
  "capabilities": {
    "canAcceptOwnership": boolean;
    "canAddChildren": boolean;
    "canAddFolderFromAnotherDrive": boolean;
    "canAddMyDriveParent": boolean;
    "canChangeCopyRequiresWriterPermission": boolean;
    "canChangeSecurityUpdateEnabled": boolean;
    "canChangeViewersCanCopyContent": boolean;
    "canComment": boolean;
    "canCopy": boolean;
    "canDelete": boolean;
    "canDeleteChildren": boolean;
    "canDownload": boolean;
    "canEdit": boolean;
    "canListChildren": boolean;
    "canModifyContent": boolean;
    "canModifyContentRestriction": boolean;
    "canModifyLabels": boolean;
    "canMoveChildrenOutOfTeamDrive": boolean;
    "canMoveChildrenOutOfDrive": boolean;
    "canMoveChildrenWithinTeamDrive": boolean;
    "canMoveChildrenWithinDrive": boolean;
    "canMoveItemIntoTeamDrive": boolean;
    "canMoveItemOutOfTeamDrive": boolean;
    "canMoveItemOutOfDrive": boolean;
    "canMoveItemWithinTeamDrive": boolean;
    "canMoveItemWithinDrive": boolean;
    "canMoveTeamDriveItem": boolean;
    "canReadLabels": boolean;
    "canReadRevisions": boolean;
    "canReadTeamDrive": boolean;
    "canReadDrive": boolean;
    "canRemoveChildren": boolean;
    "canRemoveMyDriveParent": boolean;
    "canRename": boolean;
    "canShare": boolean;
    "canTrash": boolean;
    "canTrashChildren": boolean;
    "canUntrash": boolean
  };
  "viewersCanCopyContent": boolean;
  "copyRequiresWriterPermission": boolean;
  "writersCanShare": boolean;
   "permissions": string[][];// [
  //   permissions Resource
  // ];
  "permissionIds": [
    string
  ];
  "hasAugmentedPermissions": boolean;
  "folderColorRgb": string;
  "originalFilename": string;
  "fullFileExtension": string;
  "fileExtension": string;
  "md5Checksum": string;
  "sha1Checksum": string;
  "sha256Checksum": string;
  "size": bigint;
  "quotaBytesUsed": bigint;
  "headRevisionId": string;
  "contentHints": {
    "thumbnail": {
      "image": ArrayBuffer;
      "mimeType": string
    };
    "indexableText": string
  };
  "imageMediaMetadata": {
    "width": number;
    "height": number;
    "rotation": number;
    "location": {
      "latitude": number;
      "longitude": number;
      "altitude": number
    };
    "time": string;
    "cameraMake": string;
    "cameraModel": string;
    "exposureTime": number;
    "aperture": number;
    "flashUsed": boolean;
    "focalLength": number;
    "isoSpeed": number;
    "meteringMode": string;
    "sensor": string;
    "exposureMode": string;
    "colorSpace": string;
    "whiteBalance": string;
    "exposureBias": number;
    "maxApertureValue": number;
    "subjectDistance": number;
    "lens": string
  };
  "videoMediaMetadata": {
    "width": number;
    "height": number;
    "durationMillis": bigint
  };
  "isAppAuthorized": boolean;
  "exportLinks": {
    (key: string): string
  };
  "shortcutDetails": {
    "targetId": string;
    "targetMimeType": string;
    "targetResourceKey": string
  };
  "contentRestrictions": [
    {
      "readOnly": boolean;
      "reason": string;
      "restrictingUser": {
        "kind": "drive#user";
        "displayName": string;
        "photoLink": string;
        "me": boolean;
        "permissionId": string;
        "emailAddress": string
      };
      "restrictionTime": Date;
      "type": string
    }
  ];
  "labelInfo": {
    "labels": [
      {
        "kind": "drive#label";
        "id": string;
        "revisionId": string;
        "fields": {
          (key: string): {
            "kind": "drive#labelField";
            "id": string;
            "valueType": string;
            "dateString": [
              Date
            ];
            "integer": [
              bigint
            ];
            "selection": [
              string
            ];
            "text": [
              string
            ];
            "user": [
              {
                "kind": "drive#user";
                "displayName": string;
                "photoLink": string;
                "me": boolean;
                "permissionId": string;
                "emailAddress": string
              }
            ]
          }
        }
      }
    ]
  };
  "resourceKey": string;
  "linkShareMetadata": {
    "securityUpdateEligible": boolean;
    "securityUpdateEnabled": boolean
  }
}