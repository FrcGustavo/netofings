export const queryKeys = {
  agents: {
    all: ['agents'] as const,
    byUuid: (uuid: string) => ['agents', uuid] as const,
    metrics: (uuid: string, type?: string) =>
      type ? (['metrics', uuid, type] as const) : (['metrics', uuid] as const),
  },
}
