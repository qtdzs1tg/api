const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

async function filterLinks(filePath) {
  try {
    // 1. Đọc file JSON
    const data = await fs.readFile(filePath, 'utf-8');
    const links = JSON.parse(data);

    if (!Array.isArray(links)) {
      console.error('Lỗi: File JSON không chứa một mảng.');
      return;
    }

    console.log(`Tìm thấy ${links.length} link ban đầu.`);

    // 2. Lọc link trùng lặp
    const uniqueLinks = [...new Set(links)];
    console.log(`Sau khi lọc trùng lặp còn lại ${uniqueLinks.length} link.`);

    // 3. Kiểm tra link "die"
    const liveLinks = [];
    let deadLinksCount = 0;

    console.log('Bắt đầu kiểm tra các link...');
    for (const link of uniqueLinks) {
      try {
        await axios.head(link, { timeout: 5000 }); // Dùng HEAD request để nhanh hơn
        liveLinks.push(link);
        process.stdout.write(`\r✅ Link sống: ${link}`);
      } catch (error) {
        deadLinksCount++;
        process.stdout.write(`\r❌ Link die: ${link}`);
      }
    }
    
    console.log(`\n\nKiểm tra hoàn tất.`);
    console.log(`- Tổng số link sống: ${liveLinks.length}`);
    console.log(`- Tổng số link die: ${deadLinksCount}`);

    // 4. Ghi lại file đã lọc
    await fs.writeFile(filePath, JSON.stringify(liveLinks, null, 2), 'utf-8');
    console.log(`\nĐã ghi lại các link sống vào file: ${filePath}`);

  } catch (error) {
    if (error.code === 'ENOENT') {
        console.error(`Lỗi: Không tìm thấy file tại '${filePath}'`);
    } else {
        console.error('Đã xảy ra lỗi trong quá trình xử lý:', error.message);
    }
  }
}

// Lấy đường dẫn file từ command line
const filePathArg = process.argv[2];

if (!filePathArg) {
  console.error('Vui lòng cung cấp đường dẫn đến file JSON.');
  console.log('Ví dụ: node filter.js api/vdanime.json');
  process.exit(1);
}

const absolutePath = path.resolve(filePathArg);
filterLinks(absolutePath); 