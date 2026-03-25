export const FLOOR_OVERVIEW_VALUE = 0;

export const floorExplorerAssetContract = {
  preferredMode: "namedNodes",
  namedNodePattern: "floor_01",
  shellNodePatterns: ["shell", "core", "base", "roof"],
  fallbackMode: "slice"
};

export function supportsFloorExplorer(project, asset) {
  return Boolean(project?.floorExplorer?.enabled && asset?.capabilities?.floorExplorer);
}

export function getFloorCount(project) {
  return project?.floorExplorer?.floorCount ?? project?.floorCount ?? 0;
}

export function clampFloorValue(project, value) {
  const maxFloor = getFloorCount(project);
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= FLOOR_OVERVIEW_VALUE) {
    return FLOOR_OVERVIEW_VALUE;
  }

  return Math.min(Math.max(Math.round(numericValue), 1), maxFloor);
}

export function getFloorLabel(project, value = FLOOR_OVERVIEW_VALUE) {
  if (value === FLOOR_OVERVIEW_VALUE) {
    return project?.floorExplorer?.overviewLabel ?? "Exterior";
  }

  const configuredLabel = project?.floorExplorer?.floorLabels?.[value];
  if (configuredLabel) {
    return configuredLabel;
  }

  const prefix = project?.floorExplorer?.floorLabelPrefix ?? "Floor";
  return `${prefix} ${String(value).padStart(2, "0")}`;
}

export function getFloorOptions(project) {
  const floorCount = getFloorCount(project);
  const options = [
    {
      value: FLOOR_OVERVIEW_VALUE,
      label: getFloorLabel(project, FLOOR_OVERVIEW_VALUE)
    }
  ];

  for (let floor = 1; floor <= floorCount; floor += 1) {
    options.push({
      value: floor,
      label: getFloorLabel(project, floor)
    });
  }

  return options;
}

export function getFloorFocusCopy(project, value = FLOOR_OVERVIEW_VALUE) {
  if (value === FLOOR_OVERVIEW_VALUE) {
    return project?.virtualExperience ?? "";
  }

  const configuredCopy = project?.floorExplorer?.focusCopy?.[value];
  if (configuredCopy) {
    return configuredCopy;
  }

  return `Review ${getFloorLabel(project, value).toLowerCase()} inside ${project?.name}.`;
}
