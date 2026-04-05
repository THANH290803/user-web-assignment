import { test, expect, type Page } from '@playwright/test';

// Định nghĩa 2 cổng chạy 2 cục Project khác nhau của ông
const BASE_URL_USERS = 'http://localhost:3000';
const BASE_URL_ADMIN = 'http://localhost:3001';

// Dùng .serial để ép con Bot chạy 1 mạch từ TC_01 đến TC_05, không nhảy cóc
test.describe.serial('TechStore Automation Test - Đồ án tốt nghiệp', () => {
  
  let page: Page; // Khai báo 1 tab Chrome xài chung cho đỡ bị văng đăng nhập

  // Bật đúng 1 tab lên trước khi test
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  // Chạy xong 5 test thì đóng tab dọn rác
  test.afterAll(async () => {
    await page.close();
  });

  // =======================================================
  // KỊCH BẢN 1: TỰ ĐỘNG ĐĂNG NHẬP (USER PORT 3000)
  // =======================================================
  test('TC_01: Đăng nhập thành công', async () => {
    await page.goto(`${BASE_URL_USERS}/login`); 
    
    // Gõ tài khoản, mật khẩu theo đúng thẻ HTML của Frontend
    await page.locator('input[type="username"]').fill('user01'); 
    await page.locator('input[type="password"]').fill('123@123'); 
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    
    // Đợi nhảy về trang chủ
    await expect(page).toHaveURL(BASE_URL_USERS + '/');
  });

  // =======================================================
  // KỊCH BẢN 2: TÌM KIẾM SẢN PHẨM
  // =======================================================
  test('TC_02: Tìm kiếm sản phẩm', async () => {
    // Gõ vào ô tìm kiếm và enter
    await page.getByPlaceholder(/Tìm kiếm/i).fill('iPhone 15 Thường');
    await page.getByPlaceholder(/Tìm kiếm/i).press('Enter');
    
    // Phải thấy kết quả có tên con máy này
    await expect(page.locator('body')).toContainText('iPhone 15 Thường');
  });

  // =======================================================
  // KỊCH BẢN 3: XEM CHI TIẾT & THÊM GIỎ HÀNG
  // =======================================================
  test('TC_03: Thêm sản phẩm vào giỏ', async () => {
    // Bấm vào tên điện thoại ở trang tìm kiếm để chui vào trang Chi tiết
    await page.getByText('iPhone 15 Thường', { exact: true }).first().click();

    // Trong trang chi tiết, bấm nút Thêm vào giỏ
    await page.getByRole('button', { name: /Thêm vào giỏ/i }).click();
    
    // Chờ 1 giây để Frontend gọi API báo Backend lưu xuống Database
    await page.waitForTimeout(1000); 
  });

  // =======================================================
  // KỊCH BẢN 4: CHECK GIỎ HÀNG (GIỮ ĐƯỢC PHIÊN ĐĂNG NHẬP)
  // =======================================================
  test('TC_04: Kiểm tra giao diện Giỏ hàng', async () => {
    await page.goto(`${BASE_URL_USERS}/cart`); 
    
    // Phải nhìn thấy nút Thanh toán thì mới là giỏ hàng có đồ + đang đăng nhập
    await expect(page.getByRole('button', { name: /thanh toán/i })).toBeVisible();
  });

  // =======================================================
  // KỊCH BẢN 5: BẢO MẬT CHÉO (CROSS-ORIGIN SECURITY - PORT 3001)
  // =======================================================
  test('TC_05: User không thể vào trang Admin', async () => {
    // Ép con bot gõ link sang tận nhà Admin
    await page.goto(BASE_URL_ADMIN);
    
    // Đợi Admin check quyền
    await page.waitForTimeout(1000); 
    
    // Hệ thống xịn là phải cấm cửa: Bắt nhìn thấy form "Đăng nhập", "Login" hoặc báo lỗi "403"
    await expect(page.locator('body')).toContainText(/đăng nhập|login|không có quyền|403/i);
  });

});