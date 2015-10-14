describe("Matrix", function () {
  it("should default to the Identity matrix", function () {
    var A = new mo.Matrix();

    expect(A.a).toBe(1);
    expect(A.b).toBe(0);
    expect(A.c).toBe(0);
    expect(A.d).toBe(1);
    expect(A.tx).toBe(0);
    expect(A.ty).toBe(0);

    var p = A.transformPoint(new mo.Point(1,1));
    expect(p.x).toBe(1);
    expect(p.y).toBe(1);
  });

  it("should concatenate matrices", function () {
    var A = new mo.Matrix(2, 1, 1, 1, 3, -4);
    var B = new mo.Matrix(1, 3, 1, 3);
    var C = A.concat(B);

    // Original matrices are unchanged
    expect(A).toEqual(new mo.Matrix(2, 1, 1, 1, 3, -4));
    expect(B).toEqual(new mo.Matrix(1, 3, 1, 3));

    // New, concatenated matrix
    expect(C).toEqual(new mo.Matrix(5, 4, 5, 4, 3, -4));
  });

  it("should translate", function () {
    var A = new mo.Matrix();
    var p = A.translate(3, -3).transformPoint(new mo.Point(0, 1));
    expect(p.x).toBe(3);
    expect(p.y).toBe(-2);
  });

  it("should scale");

  it("should rotate", function () {
    var A = new mo.Matrix();
    var p = new mo.Point(0, 1);
    var q = A.rotate(Math.PI / 2).transformPoint(p)

    // "Close to" because Math.sin and Math.cos might have a little rounding error
    expect(q.x).toBeCloseTo(-1);
    expect(q.y).toBeCloseTo(0);
  });

  it("should rotate about a point", function () {
    var A = new mo.Matrix();
    var p = new mo.Point(0, 1);
    var q = A.rotate(Math.PI / 2, new mo.Point(1, 1)).transformPoint(p);

    // "Close to" because Math.sin and Math.cos might have a little rounding error
    expect(q.x).toBeCloseTo(1);
    expect(q.y).toBeCloseTo(0);
  });

  it("deltaTransformPoint");

  it("getInverse");
});