export default function getBaseDomain(): string {
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT_BACKEND ?? '3000';
    return `${host}:${port}`;
}
