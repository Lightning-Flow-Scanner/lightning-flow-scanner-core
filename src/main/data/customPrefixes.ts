export default [
  {
    "Key Prefix": "CF00N",
    "Object Type": "Custom Field Id used in the query string.",
    Notes:
      'Note the keyprefix isn\'t actually CF0. In this case "CF" has been appended to the "00N" of the Custom Field Definition.',
  },
  {
    "Key Prefix": "m00",
    "Object Type": "CustomMetadata",
    Notes: "Starts incrementing from m00",
  },
  {
    "Key Prefix": "z00",
    "Object Type": "BigObjects",
    Notes: "Starts incrementing from z00",
  },
  {
    "Key Prefix": "X00",
    "Object Type": "PermissionSet Name",
    Notes:
      "Found in the PermissionSet Name column where the ProfileId is also defined. It matches the ProfileId with the exception of the key prefix.",
  },
  {
    "Key Prefix": "a00",
    "Object Type": "CustomObjects",
    Notes: "Starts incrementing from a00",
  },
  {
    "Key Prefix": "e00",
    "Object Type": "PlatformEvents",
    Notes: "Starts incrementing from e00",
  },
  {
    "Key Prefix": "h00",
    "Object Type": "HistoricalTrending",
    Notes: "Starts incrementing from h00",
  },
];
