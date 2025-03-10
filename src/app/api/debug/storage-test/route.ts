import { NextResponse } from 'next/server';
import { storageService } from '@/lib/storage/minio';

export async function GET() {
  try {
    // Generate a test key
    const testKey = `test/test-${Date.now()}.txt`;
    const testContent = Buffer.from('Test file content');
    
    // Test upload
    await storageService.uploadFile(testContent, testKey, 'text/plain');
    
    // Get a URL
    const url = await storageService.getPresignedUrl(testKey);
    
    // Cleanup after test
    await storageService.deleteFile(testKey);
    
    return NextResponse.json({
      status: 'success',
      message: 'Storage service is working',
      testKey,
      presignedUrl: url
    });
  } catch (error) {
    console.error('Storage test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}