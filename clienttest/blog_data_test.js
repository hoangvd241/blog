describe('client blog data test', function () {
	var data = blog.data;
	beforeEach(function (){
		sinon.stub($, "getJSON");
		sinon.stub($, "post");
	});

	it('getEntries', function () {
		data.getEntries(new Date(2015, 01, 12), 2);
		$.getJSON.getCall(0).args[0].should.equal('/blog/list');
		$.getJSON.getCall(0).args[1].should.eql({ year: 2015, month : 02, date: 12, limit : 2});
	});

	it('getEntry', function () {
		data.getEntry('id');
		$.getJSON.getCall(0).args[0].should.equal('/blog/read');
		$.getJSON.getCall(0).args[1].should.eql({ id : 'id'});
	});

	it('deleteEntry', function () {
		data.deleteEntry('id');
		$.getJSON.getCall(0).args[0].should.equal('/blog/delete');
		$.getJSON.getCall(0).args[1].should.eql({ id : 'id'});
	});

	it('postEntry', function () {
		data.postEntry('title', 'content');
		$.post.getCall(0).args[0].should.equal('/blog/create');
		$.post.getCall(0).args[1].should.eql({ title : 'title', content : 'content'});
	});

	afterEach(function () {
		$.getJSON.restore();
		$.post.restore();
	});
});