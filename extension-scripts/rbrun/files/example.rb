def title(s)
  puts "~ #{s} ~\n" + '~' * (s.size+4) + "\n\n"
  yield
  puts "\n\n"
end

title "The basics" do
  puts say = "I love Ruby"
  puts say.sub('love', "*love*").upcase
  3.times { puts "#{say.sub("love", "❤️")}!" }
end

title "Interacting with the DOM" do
  puts "The page title is #{`document`.JS[:title].inspect}."
  puts "The current URL is #{`location`.JS[:href].inspect}."
end

title "Classes, objects and procs" do
  class User
    attr_accessor :name

    def initialize(name)
      @name = name
    end

    def admin?
      @name == 'Joe'
    end

    def method_missing(name, *args, &block)
      if name.start_with?('can_') && name.end_with?('?')
        admin? ? true : false
      end
    end
  end

  bob = User.new('Bob')
  joe = User.new('Joe')

  user_is_admin = -> user do
    "#{user.name} #{user.admin? ? 'is' : 'is not'} an admin."
  end

  user_can_swim = -> user, action do
    "#{user.name} #{user.can_swim? ? 'can' : 'cannot'} swim."
  end

  puts user_is_admin.call joe
  puts user_can_swim.call joe
  puts user_is_admin.call bob
  puts user_can_swim.call bob
end