export const deepValue = (o: any = {}, p: string) => p.split('.').reduce((a, v) => a?.[v], o)
