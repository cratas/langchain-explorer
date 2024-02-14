import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export const GET = async () => {
  const file = await fs.readFile(`${process.cwd()}/src/app/data.json`, 'utf8');
  const { currentFile } = JSON.parse(file);

  if (currentFile) {
    return NextResponse.json({ fileName: currentFile }, { status: 200 });
  }

  return NextResponse.json({ message: 'No context file found' }, { status: 404 });
};
