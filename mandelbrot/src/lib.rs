use web_sys::ImageData;
use wasm_bindgen;
use wasm_bindgen::prelude::*;
use web_sys::console;

const MAX_ITERATIONS: usize = 100;
const PALETTE: &'static [u8] = &[0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120];

struct Point {
    x: f64,
    y: f64,
}

#[wasm_bindgen]
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[wasm_bindgen]
pub fn generate_mandelbrot(
    top_left_x: f64,
    top_left_y: f64,
    bottom_right_x: f64,
    bottom_right_y: f64,
    viewport_height: u32,
    viewport_width: u32,
) -> ImageData {
    let mut output: Vec<u8> = vec![0; (viewport_width * viewport_height * 4).try_into().unwrap()];
    let top_left = Point {
        x: top_left_x,
        y: top_left_y,
    };
    let bottom_right = Point {
        x: bottom_right_x,
        y: bottom_right_y,
    };
    fill_screen(
        &mut output,
        viewport_width as usize,
        viewport_height as usize,
        top_left,
        bottom_right
    );
    let result = ImageData::new_with_u8_clamped_array(wasm_bindgen::Clamped(output.as_slice()), viewport_width);

    match result {
        Ok(image_data) => {
            image_data
        },
        Err(error) => {
            ImageData::new_with_sw(viewport_height, viewport_width).expect("Error blah blah")
        },
    }
}

fn fill_screen(
    screen_buffer: &mut Vec<u8>, 
    width: usize, 
    height: usize, 
    top_left: Point, 
    bottom_right: Point,
) {
    // console::log_1(&"Successfully passed a vector...".into());
    let section_width: f64 = (top_left.x - bottom_right.x).abs();
    let section_height: f64 = (top_left.y - bottom_right.y).abs();

    let mut i: usize = 0;
    while i < width * height {
        // console::log_1(&i.to_string().into());
        let x: usize =  (i % width) * 4;
        let y: usize = i / (height * 4);
        let adjusted_x: f64 = (x as f64 / width as f64) * section_width;
        let adjusted_y: f64 = (y as f64 / height as f64) * section_height;
        // console::log_1(&"Going into build_pixel function".into());
        let new_pixel = build_pixel(adjusted_x, adjusted_y, width);
        // console::log_1(&"Passed build_pixel function".into());
        screen_buffer[i] = new_pixel as u8;
        screen_buffer[i + 1] = new_pixel as u8;
        screen_buffer[i + 2] = new_pixel as u8;
        screen_buffer[i + 3] = 255;

        i += 1;
    }
}

fn build_pixel(x0: f64, y0: f64, width: usize) -> u8 {
    let l2_norm = (x0.abs().powf(2.0) + y0.abs().powf(2.0)).sqrt();
    if l2_norm > 2.0 {
        return 0
    }
    let mut x2: f64 = 0.0;
    let mut y2: f64 = 0.0;

    let mut iteration: usize = 0;
    while x2 * x2 + y2 * y2 <= 4.0 && iteration < MAX_ITERATIONS {
        let xtmp: f64 = (x2 + y2) * (x2 - y2) + x0;
        y2 = 2.0 * x2 * y2 + y0;
        x2 = xtmp;

        iteration = iteration + 1;
    }

    PALETTE[iteration % PALETTE.len()]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
